import { ThemeToggle } from "@/components/theme-toggle";
// import { UserNav } from "@/components/dashboard/user-nav"; // Tận dụng component có sẵn của bạn

export function ManagerHeader() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 gap-4">
        {/* Mobile menu sẽ hiện ở đây nếu cần */}
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          {/* <UserNav /> */}
        </div>
      </div>
    </div>
  );
}
