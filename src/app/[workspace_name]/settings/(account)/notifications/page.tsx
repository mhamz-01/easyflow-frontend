import { Bell } from "lucide-react";

const NotifcationsSetting = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-muted mb-6">
        <Bell className="w-8 h-8 text-muted-foreground" />
      </div>

      <h3 className="text-xl font-semibold tracking-tight text-foreground mb-2">
        Coming Soon
      </h3>

      <p className="text-sm text-muted-foreground max-w-xs">
        Notification settings are still in the works. You'll be able to
        manage your preferences here soon.
      </p>
    </div>
  );
};

export default NotifcationsSetting;
