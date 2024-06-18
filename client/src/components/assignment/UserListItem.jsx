import { useDrag } from 'react-dnd';

import { ListItem, ListItemText } from '@mui/material';

import { UserType } from "../../utils/types";

/**
 * Component for displaying a single user in a list.
 * @param {Object} props - The component props.
 * @param {Object} props.user - The user object.
 * @param {number} props.index - The index of the user in the list.
 * @returns {JSX.Element} - The rendered component.
 */
export default function UserListItem({ user, index }) {

    // Set up the drag and drop functionality for the user list item
    const [{ isDragging }, drag] = useDrag({
        type: UserType, // Define the type of the dragged item
        item: () => ({ user, index }), // Return the user and index as the item to be dragged
        collect: monitor => ({
            isDragging: monitor.isDragging(), // Check if the item is being dragged
        }),
    });

    return (
        // Render the user list item as a div with drag and drop functionality
        <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1, padding: '8px', borderRadius: '4px' }}>
            {/* Render the list item */}
            <ListItem>
                {/* Render the primary and secondary text for the list item */}
                <ListItemText primary={user.username} secondary={user.roleDescription} />
            </ListItem>
        </div>
    );
};
