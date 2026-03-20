from prisma import Prisma
from prisma.models import MasterResume, WorkExperience, Project, Education, Skill
from typing import Optional
import logging

logger = logging.getLogger(__name__)


class DatabaseManager:
    def __init__(self):
        self.prisma = Prisma()

    async def connect(self):
        """Connect to the database"""
        try:
            await self.prisma.connect()
            logger.info("Database connected successfully")
        except Exception as e:
            logger.error(f"Failed to connect to database: {e}")
            raise

    async def disconnect(self):
        """Disconnect from the database"""
        await self.prisma.disconnect()
        logger.info("Database disconnected")

    async def save_resume_data(
        self,
        user_id: str,
        resume_data: dict
    ) -> MasterResume:
        """Save or update master resume with parsed data"""

        # First, create or update the master resume
        personal_info = resume_data.get('personal_info', {})

        master_resume = await self.prisma.masterresume.upsert(
            where={
                'userId': user_id
            },
            data={
                'create': {
                    'userId': user_id,
                    'fullName': personal_info.get('fullName') or '',
                    'email': personal_info.get('email') or '',
                    'phone': personal_info.get('phone') or '',
                    'location': personal_info.get('location') or '',
                    'summary': personal_info.get('summary') or '',
                },
                'update': {
                    'fullName': personal_info.get('fullName') or '',
                    'email': personal_info.get('email') or '',
                    'phone': personal_info.get('phone') or '',
                    'location': personal_info.get('location') or '',
                    'summary': personal_info.get('summary') or '',
                }
            }
        )

        logger.info(f"Saved master resume for user {user_id}")

        # Clear existing related data
        await self.prisma.workexperience.delete_many(
            where={'masterResumeId': master_resume.id}
        )
        await self.prisma.project.delete_many(
            where={'masterResumeId': master_resume.id}
        )
        await self.prisma.education.delete_many(
            where={'masterResumeId': master_resume.id}
        )
        await self.prisma.skill.delete_many(
            where={'masterResumeId': master_resume.id}
        )

        # Insert work experience
        if resume_data.get('work_experience'):
            for exp in resume_data['work_experience']:
                await self.prisma.workexperience.create({
                    'masterResumeId': master_resume.id,
                    'company': exp.get('company') or '',
                    'position': exp.get('position') or '',
                    'startDate': exp.get('startDate'),
                    'endDate': exp.get('endDate'),
                    'description': exp.get('description') or '',
                    'aiAnnotation': exp.get('aiAnnotation') or '',
                })

        # Insert projects
        if resume_data.get('projects'):
            for proj in resume_data['projects']:
                await self.prisma.project.create({
                    'masterResumeId': master_resume.id,
                    'name': proj.get('name') or '',
                    'description': proj.get('description') or '',
                    'startDate': proj.get('startDate'),
                    'endDate': proj.get('endDate'),
                    'url': proj.get('url') or '',
                    'aiAnnotation': proj.get('aiAnnotation') or '',
                })

        # Insert education
        if resume_data.get('education'):
            for edu in resume_data['education']:
                await self.prisma.education.create({
                    'masterResumeId': master_resume.id,
                    'school': edu.get('school') or '',
                    'degree': edu.get('degree') or '',
                    'major': edu.get('major') or '',
                    'startDate': edu.get('startDate'),
                    'endDate': edu.get('endDate'),
                    'gpa': edu.get('gpa'),
                })

        # Insert skills
        if resume_data.get('skills'):
            for skill in resume_data['skills']:
                await self.prisma.skill.create({
                    'masterResumeId': master_resume.id,
                    'name': skill.get('name') or '',
                    'category': skill.get('category') or '',
                    'proficiency': skill.get('proficiency') or 'INTERMEDIATE',
                })

        logger.info(f"Saved {len(resume_data.get('work_experience', []))} work experiences, "
                   f"{len(resume_data.get('projects', []))} projects, "
                   f"{len(resume_data.get('education', []))} education entries, "
                   f"{len(resume_data.get('skills', []))} skills")

        return master_resume


# Global database manager instance
db_manager = DatabaseManager()
