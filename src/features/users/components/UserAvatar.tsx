import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function UserAvatar({
  user,
  ...props
}: {
  user: {
    name: string;
    imageUrl: string;
  };
} & React.ComponentPropsWithoutRef<typeof Avatar>) {
  return (
    <Avatar {...props}>
      <AvatarImage src={user.imageUrl} alt={user.name} />
      <AvatarFallback>
        {user.name
          .split(" ")
          .slice(0, 2)
          .map((n) => n[0])
          .join("")
          .toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}
