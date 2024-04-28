type HomeFormOptions = {
  audioOnly: boolean
  saveTo?: string
}

export type HomeForm = HomeFormOptions & {
  type: string
  url?: string
  file?: string
}

export type SettingsForm = {
  saveTo?: string
  logsFontSize: number
  notifications: boolean
}
