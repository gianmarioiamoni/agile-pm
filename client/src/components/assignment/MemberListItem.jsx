import { useId } from 'react';


import { ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material'; 



/**
 * Component for displaying a single team member in a list.
 * @param {Object} props - The component props.
 * @param {Object} props.member - The team member object.
 * @param {Function} props.handleRemoveMember - The function to handle removing a team member.
 * @returns {JSX.Element} - The rendered component.
 */
export default function MemberListItem ({ member, handleRemoveMember }) {
    
    /**
     * Handles the event of removing a team member.
     * Calls the handleRemoveMember prop function with the member object.
     */
    const handleRemove = () => {
        handleRemoveMember(member);
    };

    return (
        // Wrap the list item in a div with a unique id
        <div>
            {/* Render the list item */}
            <ListItem key={useId()}>
                {/* Render the primary and secondary text for the list item */}
                <ListItemText primary={member.username} secondary={member.roleDescription} />
                {/* Render the secondary action for the list item */}
                <ListItemSecondaryAction>
                    {/* Render the delete icon button */}
                    <IconButton edge="end" onClick={handleRemove}>
                        <DeleteIcon />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
        </div>
    );
};
