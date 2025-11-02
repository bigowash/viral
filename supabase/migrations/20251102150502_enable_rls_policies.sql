-- Migration: Enable Row Level Security (RLS) on all tables
-- Basic policies - should be refined based on business logic

-- ============================================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================================

-- Core Identity
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Brand Organization
ALTER TABLE brand_organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_wallet ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_transactions ENABLE ROW LEVEL SECURITY;

-- Creator Profiles
ALTER TABLE creator_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_wallet ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_transactions ENABLE ROW LEVEL SECURITY;

-- Social Media
ALTER TABLE social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_account_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE instagram_account_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE tiktok_account_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE youtube_account_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_engagement_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_showcase_posts ENABLE ROW LEVEL SECURITY;

-- Jobs
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

-- Contracts & Payments
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliverables ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliverable_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Reviews
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Analytics
ALTER TABLE post_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE contract_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_analytics ENABLE ROW LEVEL SECURITY;

-- Messaging
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- BASIC RLS POLICIES
-- Note: These are permissive starter policies. Refine based on business needs.
-- ============================================================================

-- Users: Can view and update own record
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (id = auth.uid()::uuid);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (id = auth.uid()::uuid);

-- Brand Organizations: Members can view their organization
CREATE POLICY "Brand members can view their organization" ON brand_organizations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM brand_members
      WHERE brand_members.brand_organization_id = brand_organizations.id
      AND brand_members.user_id = auth.uid()::uuid
    )
  );

-- Brand Members: Can view members of their organization
CREATE POLICY "View brand members of own organization" ON brand_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM brand_members bm
      WHERE bm.brand_organization_id = brand_members.brand_organization_id
      AND bm.user_id = auth.uid()::uuid
    )
  );

-- Creator Profiles: Creators can view/update own profile, others can view public profiles
CREATE POLICY "Creators can view own profile" ON creator_profiles
  FOR SELECT USING (user_id = auth.uid()::uuid);

CREATE POLICY "Creators can update own profile" ON creator_profiles
  FOR UPDATE USING (user_id = auth.uid()::uuid);

CREATE POLICY "Anyone can view public creator profiles" ON creator_profiles
  FOR SELECT USING (account_status = 'active');

-- Jobs: Public jobs visible to all, private to organization members
CREATE POLICY "Anyone can view public jobs" ON jobs
  FOR SELECT USING (visibility = 'public' AND status IN ('open', 'in_progress'));

CREATE POLICY "Brand members can view their jobs" ON jobs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM brand_members
      WHERE brand_members.brand_organization_id = jobs.brand_organization_id
      AND brand_members.user_id = auth.uid()::uuid
    )
  );

-- Contracts: Parties can view their contracts
CREATE POLICY "Brand and creator can view their contracts" ON contracts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM brand_members
      WHERE brand_members.brand_organization_id = contracts.brand_organization_id
      AND brand_members.user_id = auth.uid()::uuid
    )
    OR
    EXISTS (
      SELECT 1 FROM creator_profiles
      WHERE creator_profiles.id = contracts.creator_profile_id
      AND creator_profiles.user_id = auth.uid()::uuid
    )
  );

-- Notifications: Users can view own notifications
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (user_id = auth.uid()::uuid);

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (user_id = auth.uid()::uuid);

-- Note: Additional policies should be added for INSERT, UPDATE, DELETE operations
-- based on specific business requirements for each table.

