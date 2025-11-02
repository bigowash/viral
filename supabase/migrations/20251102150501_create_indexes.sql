-- Migration: Create all performance indexes for Creator Marketplace Platform

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Users & Authentication
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_account_type ON users(account_type);

-- Brand Organization
CREATE INDEX idx_brand_members_org_id ON brand_members(brand_organization_id);
CREATE INDEX idx_brand_members_user_id ON brand_members(user_id);
CREATE INDEX idx_brand_transactions_org_id ON brand_transactions(brand_organization_id);
CREATE INDEX idx_brand_transactions_wallet_id ON brand_transactions(brand_wallet_id);

-- Creator Profiles
CREATE INDEX idx_creator_profiles_work_status ON creator_profiles(work_status);
CREATE INDEX idx_creator_transactions_profile_id ON creator_transactions(creator_profile_id);
CREATE INDEX idx_creator_experiences_profile_id ON creator_experiences(creator_profile_id);
CREATE INDEX idx_creator_experiences_source_type ON creator_experiences(source_type);

-- Social Accounts
CREATE INDEX idx_social_accounts_creator_id ON social_accounts(creator_profile_id);
CREATE INDEX idx_social_accounts_type ON social_accounts(account_type);
CREATE INDEX idx_social_accounts_platform ON social_accounts(platform);
CREATE INDEX idx_social_accounts_job_id ON social_accounts(job_id);
CREATE INDEX idx_posts_account_id ON posts(social_account_id);
CREATE INDEX idx_posts_contract_id ON posts(contract_id);
CREATE INDEX idx_post_engagement_tracked_at ON post_engagement_metrics(tracked_at);
CREATE INDEX idx_social_account_metrics_tracking ON social_account_metrics(social_account_id, tracked_at DESC);
CREATE INDEX idx_post_engagement_tracking ON post_engagement_metrics(post_id, tracked_at DESC);

-- Jobs
CREATE INDEX idx_jobs_brand_org_id ON jobs(brand_organization_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_published_at ON jobs(published_at);

-- Applications
CREATE INDEX idx_job_applications_job_id ON job_applications(job_id);
CREATE INDEX idx_job_applications_creator_id ON job_applications(creator_profile_id);
CREATE INDEX idx_job_applications_status ON job_applications(application_status);

-- Contracts
CREATE INDEX idx_contracts_job_id ON contracts(job_id);
CREATE INDEX idx_contracts_brand_org_id ON contracts(brand_organization_id);
CREATE INDEX idx_contracts_creator_id ON contracts(creator_profile_id);
CREATE INDEX idx_contracts_status ON contracts(status);

-- Payments
CREATE INDEX idx_payments_contract_id ON payments(contract_id);
CREATE INDEX idx_payments_status ON payments(status);

-- Deliverables
CREATE INDEX idx_deliverables_contract_id ON deliverables(contract_id);
CREATE INDEX idx_deliverables_status ON deliverables(status);

-- Reviews
CREATE INDEX idx_reviews_contract_id ON reviews(contract_id);
CREATE INDEX idx_reviews_reviewee ON reviews(reviewee_type, reviewee_id);

-- Messages
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);

-- Notifications
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);

-- Analytics
CREATE INDEX idx_contract_analytics_contract_id ON contract_analytics(contract_id);
CREATE INDEX idx_job_analytics_job_id ON job_analytics(job_id);
CREATE INDEX idx_creator_analytics_profile_period ON creator_analytics(creator_profile_id, period_start, period_end);
CREATE INDEX idx_brand_analytics_org_period ON brand_analytics(brand_organization_id, period_start, period_end);

