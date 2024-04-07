import { MainForm } from "@/app/types/form";

export function addOptions(data: MainForm) {
  let res = [];

  if (data.audio_only) {
    res.push('-x');
  }

  if (data.save_to) {
    res.push('-P');
    res.push(data.save_to);
  }

  res.push(data.url);

  return res;
}
