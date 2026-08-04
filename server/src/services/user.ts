import mongoose from 'mongoose';

export interface PublicUser {
  id: string;
  name: string;
  avatar: string;
  bio?: string;
}

export interface UserProfile {
  name?: string;
  bio?: string;
  skillLevel?: string;
  socialLinks?: { github?: string; linkedin?: string; twitter?: string };
  preferences?: { theme?: string; emailNotifications?: boolean; language?: string };
}

export type UserStat = 'totalSessions' | 'totalHours' | 'totalProjects' | 'completedProjects';

// better-auth stores users in a plain MongoDB collection (there is no Mongoose
// model for it), so all direct access to that collection lives here.
function getUserCollection() {
  return mongoose.connection.db?.collection('user');
}

export async function getUserById(id: string) {
  const col = getUserCollection();
  if (!col) return null;
  if (!mongoose.isValidObjectId(id)) return null;
  return col.findOne({ _id: new mongoose.Types.ObjectId(id) });
}

export async function getPublicUserById(id: string): Promise<PublicUser | null> {
  const col = getUserCollection();
  if (!col) return null;
  const user = await col.findOne({ id }, { projection: { id: 1, name: 1, avatar: 1, bio: 1, _id: 0 } });
  // The driver types collection documents generically, so narrow to the shape we read.
  return (user as PublicUser | null) ?? null;
}

export async function getPublicUsersByIds(ids: string[]): Promise<PublicUser[]> {
  const col = getUserCollection();
  if (!col) return [];
  const users = await col
    .find({ id: { $in: [...new Set(ids)] } })
    .project({ id: 1, name: 1, avatar: 1, _id: 0 })
    .toArray();
  return users as PublicUser[];
}

export async function findUsers(search: string | undefined, page: number, limit: number) {
  const col = getUserCollection();
  if (!col) return { users: [], total: 0 };

  const query = search ? { name: { $regex: search, $options: 'i' } } : {};

  const users = await col
    .find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();

  const total = await col.countDocuments(query);

  return { users, total };
}

export async function countUsers() {
  const col = getUserCollection();
  return col ? col.countDocuments() : 0;
}

export async function updateUserRoleById(id: string, role: string) {
  const col = getUserCollection();
  if (!col) return null;
  return col.findOneAndUpdate(
    { id },
    { $set: { role } },
    { returnDocument: 'after' }
  );
}

export async function updateUserProfile(id: string, profile: UserProfile) {
  const col = getUserCollection();
  if (!col) return null;

  const update: Record<string, unknown> = {};
  if (profile.name !== undefined) update.name = profile.name;
  if (profile.bio !== undefined) update.bio = profile.bio;
  if (profile.skillLevel !== undefined) update.skillLevel = profile.skillLevel;
  if (profile.socialLinks !== undefined) update.socialLinks = JSON.stringify(profile.socialLinks);
  if (profile.preferences !== undefined) update.preferences = JSON.stringify(profile.preferences);

  if (Object.keys(update).length === 0) {
    return getUserById(id);
  }

  await col.updateOne({ id }, { $set: update });
  return getUserById(id);
}

export async function setUserAvatar(id: string, url: string) {
  const col = getUserCollection();
  if (!col) return null;
  await col.updateOne({ id }, { $set: { image: url } });
  return getUserById(id);
}

export async function getUserBadges(id: string): Promise<string[]> {
  const col = getUserCollection();
  if (!col) return [];
  const user = await col.findOne({ id });
  return user?.badges || [];
}

export async function markUserActive(id: string) {
  await getUserCollection()?.updateOne({ id }, { $set: { lastActive: new Date() } });
}

export async function addUserStat(id: string, stat: UserStat, amount: number) {
  await getUserCollection()?.updateOne({ id }, { $inc: { [stat]: amount } });
}
