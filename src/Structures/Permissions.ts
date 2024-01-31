export enum Permission {
  None = 0,
  Admin = 1,
  Mod = 2,
  User = 4,
  All = 7,

  // Reaction Permission
  Reaction = 8,
  ReactionAdd = 16,
  ReactionMute = 32,

  // Redirect Permission
  Redirect = 64,
  RedirectAdd = 128,
  RedirectRemove = 256,
  RedirectChangeReply = 512,
  RedirectList = 1024,
}