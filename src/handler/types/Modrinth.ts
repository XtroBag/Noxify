// ----------------- Enums & Aliases -----------------

export type ModrinthSideSupport = "required" | "optional" | "unsupported" | "unknown";

export type ModrinthProjectStatus =
  | "approved" | "archived" | "rejected" | "draft" | "unlisted"
  | "processing" | "withheld" | "scheduled" | "private" | "unknown";

export type ModrinthRequestedStatus =
  | "approved" | "archived" | "unlisted" | "private" | "draft";

export type ModrinthProjectType = "mod" | "modpack" | "resourcepack" | "shader";

export type ModrinthMonetizationStatus = "monetized" | "demonetized" | "force-demonetized";

export type ModrinthVersionStatus =
  | "listed" | "archived" | "draft" | "unlisted" | "scheduled" | "unknown";

// ----------------- Reusable Interfaces -----------------

export interface ModrinthDonationLink {
  id: string;
  platform: string;
  url: string;
}

export interface ModrinthLicense {
  id: string;
  name: string;
  url?: string | null;
}

export interface ModrinthGalleryImage {
  url: string;
  featured: boolean;
  title?: string | null;
  description?: string | null;
  created: string;
  ordering?: number;
}

export interface ModrinthModeratorMessage {
  message: string;
  body?: string | null;
}

// ----------------- Project Types -----------------

export interface ModrinthFullProject {
  id: string;
  slug: string;
  title: string;
  description: string;
  body: string;
  status: ModrinthProjectStatus;
  requested_status?: ModrinthRequestedStatus | null;
  categories: string[];
  additional_categories?: string[];
  client_side: ModrinthSideSupport;
  server_side: ModrinthSideSupport;
  project_type: ModrinthProjectType;
  downloads: number;
  icon_url?: string | null;
  color?: number | null;
  thread_id?: string;
  monetization_status?: ModrinthMonetizationStatus;
  team: string;
  body_url?: string | null;
  moderator_message?: ModrinthModeratorMessage;
  published: string;
  updated: string;
  approved?: string | null;
  queued?: string | null;
  followers: number;
  license: ModrinthLicense;
  versions: string[];
  game_versions: string[];
  loaders: string[];
  gallery?: ModrinthGalleryImage[];
  issues_url?: string | null;
  source_url?: string | null;
  wiki_url?: string | null;
  discord_url?: string | null;
  donation_urls?: ModrinthDonationLink[];
}

export interface ProjectDependency extends ModrinthFullProject {} // same structure

export interface ProjectDependenciesResponse {
  projects: ProjectDependency[];
  versions: ModrinthVersion[];
}

// ----------------- Version -----------------

export interface ModrinthFile {
  hashes: Record<string, string>;
  url: string;
  filename: string;
  primary: boolean;
  size: number;
}

export interface ModrinthVersionDependency {
  version_id?: string;
  project_id?: string;
  file_name?: string;
  dependency_type: "required" | "optional" | "incompatible" | "embedded";
}

export interface ModrinthVersion {
  id: string;
  project_id: string;
  author_id: string;
  name: string;
  version_number: string;
  changelog?: string | null;
  changelog_url?: string | null;
  dependencies: ModrinthVersionDependency[];
  game_versions: string[];
  version_type: "release" | "beta" | "alpha";
  loaders: string[];
  featured: boolean;
  status: ModrinthVersionStatus;
  requested_status?: ModrinthVersionStatus | null;
  date_published: string;
  downloads: number;
  files: ModrinthFile[];
}

// ----------------- Search -----------------

export interface ModrinthSearchResultProject {
  slug?: string;
  title?: string;
  description?: string;
  categories?: string[];
  client_side?: ModrinthSideSupport;
  server_side?: ModrinthSideSupport;
  project_type: ModrinthProjectType;
  downloads: number;
  icon_url?: string;
  color?: number;
  thread_id?: string;
  monetization_status?: ModrinthMonetizationStatus;
  project_id: string;
  author: string;
  display_categories?: string[];
  versions: string[];
  follows: number;
  date_created: string;
  date_modified: string;
  latest_version?: string;
  license: string;
  gallery?: string[];
  featured_gallery?: string;
}

export interface ModrinthSearchResponse {
  hits: ModrinthSearchResultProject[];
  offset: number;
  limit: number;
  total_hits: number;
}

// ----------------- User -----------------

export interface ModrinthUser {
  id: string;
  username: string;
  name: string | null;
  email?: string | null;
  bio?: string;
  avatar_url: string;
  created: string;
  role: "admin" | "moderator" | "developer";
  badges?: number;
  payout_data?: {
    balance?: number;
    payout_wallet?: "paypal" | "venmo";
    payout_wallet_type?: "email" | "phone" | "user_handle";
    payout_address?: string;
  };
  auth_providers?: string[] | null;
  email_verified?: boolean | null;
  has_password?: boolean | null;
  has_totp?: boolean | null;
  github_id?: number | null; // deprecated
}

export interface ModrinthTeamMember {
  team_id: string;
  user: {
    id: string;
    username: string;
    name: string | null;
    email?: string | null;
    bio?: string;
    payout_data?: {
      balance?: number;
      payout_wallet?: 'paypal' | 'venmo';
      payout_wallet_type?: 'email' | 'phone' | 'user_handle';
      payout_address?: string;
    };
    avatar_url: string;
    created: string; // ISO-8601
    role: 'admin' | 'moderator' | 'developer';
    badges?: number;
    auth_providers?: string[] | null;
    email_verified?: boolean | null;
    has_password?: boolean | null;
    has_totp?: boolean | null;
    github_id?: number | null; // deprecated
  };
  role: string; // e.g. "Member", "Owner"
  permissions?: number; // bitfield, only if authorized
  accepted: boolean;
  payouts_split?: number;
  ordering?: number;
}