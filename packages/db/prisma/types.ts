import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

import type { SubscriptionPlan, Status } from "./enums";

export type Account = {
    id: Generated<string>;
    userId: string;
    type: string;
    provider: string;
    providerAccountId: string;
    refresh_token: string | null;
    access_token: string | null;
    expires_at: number | null;
    token_type: string | null;
    scope: string | null;
    id_token: string | null;
    session_state: string | null;
};
export type Customer = {
    id: Generated<number>;
    authUserId: string;
    name: string | null;
    plan: SubscriptionPlan | null;
    stripeCustomerId: string | null;
    stripeSubscriptionId: string | null;
    stripePriceId: string | null;
    stripeCurrentPeriodEnd: Timestamp | null;
    createdAt: Generated<Timestamp>;
    updatedAt: Generated<Timestamp>;
};
export type K8sClusterConfig = {
    id: Generated<number>;
    name: string;
    location: string;
    authUserId: string;
    plan: Generated<SubscriptionPlan | null>;
    network: string | null;
    createdAt: Generated<Timestamp>;
    updatedAt: Generated<Timestamp>;
    status: Generated<Status | null>;
    delete: Generated<boolean | null>;
};
export type Session = {
    id: Generated<string>;
    sessionToken: string;
    userId: string;
    expires: Timestamp;
};
export type User = {
    id: Generated<string>;
    name: string | null;
    email: string | null;
    emailVerified: Timestamp | null;
    image: string | null;
};
export type VerificationToken = {
    identifier: string;
    token: string;
    expires: Timestamp;
};
export type MasterResume = {
    id: Generated<string>;
    userId: string;
    name: Generated<string | null>;
    createdAt: Generated<Timestamp>;
    updatedAt: Generated<Timestamp>;
};
export type WorkExperience = {
    id: Generated<string>;
    masterResumeId: string;
    company: string;
    position: string;
    startDate: Timestamp;
    endDate: Timestamp | null;
    current: Generated<boolean>;
    description: string | null;
    achievements: unknown;
    aiAnnotations: unknown;
    interviewData: unknown;
    createdAt: Generated<Timestamp>;
    updatedAt: Generated<Timestamp>;
};
export type Project = {
    id: Generated<string>;
    masterResumeId: string;
    name: string;
    role: string;
    startDate: Timestamp;
    endDate: Timestamp | null;
    description: string | null;
    achievements: unknown;
    aiAnnotations: unknown;
    interviewData: unknown;
    createdAt: Generated<Timestamp>;
    updatedAt: Generated<Timestamp>;
};
export type Education = {
    id: Generated<string>;
    masterResumeId: string;
    school: string;
    degree: string;
    major: string;
    startDate: Timestamp;
    endDate: Timestamp | null;
    gpa: string | null;
    description: string | null;
    createdAt: Generated<Timestamp>;
    updatedAt: Generated<Timestamp>;
};
export type Skill = {
    id: Generated<string>;
    masterResumeId: string;
    name: string;
    level: string | null;
    category: string | null;
    createdAt: Generated<Timestamp>;
    updatedAt: Generated<Timestamp>;
};
export type JobApplication = {
    id: Generated<string>;
    userId: string;
    companyId: string | null;
    position: string | null;
    jdText: string | null;
    jdKeywords: unknown;
    matchScore: number | null;
    resumeSnapshot: unknown;
    optimizedResume: unknown;
    aiSuggestions: unknown;
    status: Generated<string | null>;
    createdAt: Generated<Timestamp>;
    updatedAt: Generated<Timestamp>;
};
export type DB = {
    Account: Account;
    Customer: Customer;
    K8sClusterConfig: K8sClusterConfig;
    Session: Session;
    User: User;
    VerificationToken: VerificationToken;
    MasterResume: MasterResume;
    WorkExperience: WorkExperience;
    Project: Project;
    Education: Education;
    Skill: Skill;
    JobApplication: JobApplication;
};
