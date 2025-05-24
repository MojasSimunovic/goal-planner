export interface Routine {
  userId?: string,
  id? : string,
  name: string,
  icon: string,
  completions: [boolean, boolean,boolean,boolean,boolean,boolean, boolean]
}