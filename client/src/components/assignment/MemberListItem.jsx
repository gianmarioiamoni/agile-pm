import { useDrop } from "react-dnd";

import { ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material'; 

import { UserType } from "../../utils/types";


export default function MemberListItem ({ member, handleAddMember, handleRemoveMember }) {
    const [{ isOver }, drop] = useDrop({
        accept: UserType,
        drop: (item) => handleAddMember(item.user),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    });

    return (
        <div ref={drop} style={{ backgroundColor: isOver ? 'lightblue' : 'transparent', padding: '8px', borderRadius: '4px' }}>
            <ListItem>
                <ListItemText primary={member.username} secondary={member.role} />
                <ListItemSecondaryAction>
                    {/* <IconButton edge="end" onClick={() => handleUpdateMember(member.id, member.role)}>
                        <EditIcon />
                    </IconButton> */}
                    <IconButton edge="end" onClick={() => handleRemoveMember(member)}>
                        <DeleteIcon />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
            
        </div>
    );
};