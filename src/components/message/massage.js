import template from "./message.hbs";

export function renderMessage({
  avatar,
  author,
  imageUrl,
  text,
  time,
  status,
  isMine = false,
}) {
  const hasImage = Boolean(imageUrl);

  return template({
    avatar,
    author,
    imageUrl,
    text,
    time,
    status,
    isMine,
    hasImage,
  });
}
