import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import styles from "./profile.module.css";
interface Props {
  icon: React.ReactNode;
  text: string;
}
const ProfileItem = ({ icon, text }: Props) => {
  return (
    <DropdownMenuItem className={styles.trigger}>
      <div className='flex items-center gap-3'>
        {icon}
        {text}
      </div>
    </DropdownMenuItem>
  );
};

export default ProfileItem;
