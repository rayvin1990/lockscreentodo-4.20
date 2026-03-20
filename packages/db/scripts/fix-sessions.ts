import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixOrphanedSessions() {
  console.log('🔍 检查孤立的 Session 记录...\n');

  try {
    // 1. 查找所有孤立的 Session（引用了不存在的 User）
    const orphanedSessions = await prisma.$queryRaw`
      SELECT s.id, s."userId", s."sessionToken", s.expires
      FROM "Session" s
      LEFT JOIN "User" u ON s."userId" = u.id
      WHERE u.id IS NULL
    ` as Array<{ id: string; userId: string; sessionToken: string; expires: Date }>;

    console.log(`找到 ${orphanedSessions.length} 条孤立的 Session 记录`);

    if (orphanedSessions.length === 0) {
      console.log('✅ 数据库正常，没有孤立的 Session');
      return;
    }

    // 显示前几条记录
    console.log('\n前 5 条孤立记录：');
    orphanedSessions.slice(0, 5).forEach((session, index) => {
      console.log(`${index + 1}. ID: ${session.id}`);
      console.log(`   User ID: ${session.userId}`);
      console.log(`   Token: ${session.sessionToken.substring(0, 20)}...`);
      console.log(`   过期时间: ${session.expires}\n`);
    });

    // 2. 删除孤立的 Session
    console.log('🧹 开始清理...\n');

    const orphanedIds = orphanedSessions.map(s => s.id);

    // 分批删除（每批 100 条）
    const batchSize = 100;
    for (let i = 0; i < orphanedIds.length; i += batchSize) {
      const batch = orphanedIds.slice(i, i + batchSize);
      await prisma.$executeRaw`
        DELETE FROM "Session"
        WHERE id = ANY(${batch})
      `;
      console.log(`已删除 ${Math.min(i + batchSize, orphanedIds.length)}/${orphanedIds.length} 条记录`);
    }

    console.log('\n✅ 清理完成！');

    // 3. 验证结果
    const remainingOrphaned = await prisma.$queryRaw`
      SELECT COUNT(*) as count
      FROM "Session" s
      LEFT JOIN "User" u ON s."userId" = u.id
      WHERE u.id IS NULL
    ` as Array<{ count: bigint }>;

    console.log(`剩余孤立记录: ${remainingOrphaned[0].count} 条`);

    // 4. 显示数据库统计
    const userCount = await prisma.user.count();
    const sessionCount = await prisma.session.count();

    console.log('\n📊 数据库统计：');
    console.log(`User 总数: ${userCount}`);
    console.log(`Session 总数: ${sessionCount}`);

  } catch (error) {
    console.error('❌ 清理失败:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

console.log('开始修复数据库...\n');
fixOrphanedSessions()
  .then(() => {
    console.log('\n✨ 修复完成！');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 修复失败:', error);
    process.exit(1);
  });
