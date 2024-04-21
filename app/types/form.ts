type HomeFormOptions = {
  audioOnly: boolean
  saveTo?: string
}

export type HomeForm = { url: string } & HomeFormOptions;

export type SettingsForm = {
  saveTo?: string
  terminalFontSize: number
  notifications: boolean
}
