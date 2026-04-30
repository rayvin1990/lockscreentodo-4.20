async function main() {
  const args = process.argv.slice(2);
  const apiKey = args[0];

  if (!apiKey) {
    console.error("Usage: npx tsx scripts/test_push_pipeline.ts <your-agent-api-key>");
    console.error("Get your API Key from https://lockscreentodo.com/en/dashboard/settings");
    process.exit(1);
  }

  console.log("\n[1] Simulating Agent MCP call to push_lockscreen_reminders...");
  
  // Prepare payload
  const payload = {
    reminders: [
      {
        title: "P0: 数据库连接数飙升",
        note: "发现 prod-db-01 连接数异常，可能导致宕机。",
        ttsText: "生产环境数据库出现异常连接，请立即检查！",
        priority: "critical",
        kind: "ops-alert",
        requiresHuman: true,
      },
      {
        title: "买一瓶牛奶",
        note: "下班顺路去一趟超市",
        priority: "low",
        kind: "grocery",
        requiresHuman: true,
      }
    ]
  };

  const apiUrl = "https://lockscreentodo.com/api/mcp";
  console.log(`    POST ${apiUrl}`);

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "test-push-prod",
        method: "tools/call",
        params: {
          name: "push_lockscreen_reminders",
          arguments: payload
        }
      })
    });

    const result = await response.json();
    console.log("\n[2] MCP API Response:");
    console.log(JSON.stringify(result, null, 2));

    if (result.error) {
      console.error("Push failed:", result.error);
    } else {
      console.log("\n✅ Push successful!");
      console.log("If your Bark/Pushcut is configured correctly, your phone just rang.");
      console.log("Tap the notification to run your Shortcut and update the wallpaper.");
    }
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

main().catch(console.error);