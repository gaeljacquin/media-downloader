import { FormInput } from "@/app/types/form-input";

export function addOptions(data: FormInput) {
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
