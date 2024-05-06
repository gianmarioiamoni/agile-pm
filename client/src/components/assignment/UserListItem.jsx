import { useDrag } from 'react-dnd';

import { ListItem, ListItemText } from '@mui/material';

import { UserType } from "../../utils/types";

export default function UserListItem({ user, index }) {

    const [{ isDragging }, drag] = useDrag({
        type: UserType,
        item: () => ({ user, index }),
        collect: monitor => ({
            isDragging: monitor.isDragging(),
        }),
    });


    return (
        <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1, padding: '8px', borderRadius: '4px' }}>
            <ListItem>
                <ListItemText primary={user.username} secondary={user.role} />
            </ListItem>
        </div>
    );
};