import { HomeForm } from "@/app/types/form";

export function addOptions(data: HomeForm) {
  let res = [];

  if (data.audioOnly) {
    res.push('-x');
  }

  if (data.saveTo) {
    res.push('-P');
    res.push(data.saveTo);
  }

  res.push(data.url);

  return res;
}
