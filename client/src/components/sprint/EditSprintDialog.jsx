import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button } from '@mui/material';
import { format } from 'date-fns';

export default function EditSprintDialog({ open, sprint, onSave, onClose}) {
    const [editedSprint, setEditedSprint] = useState({ ...sprint });

    useEffect(() => {
        if (sprint) {
            setEditedSprint({
                ...sprint,
                startDate: format(new Date(sprint.startDate), 'yyyy-MM-dd'),
                endDate: format(new Date(sprint.endDate), 'yyyy-MM-dd'),
            });
        }
    }, [sprint]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedSprint(prevSprint => ({
            ...prevSprint,
            [name]: value,
        }));
    };

    // const handleSave = () => {
    //     onSave(editedSprint);
    //     onClose();
    // };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Edit Sprint</DialogTitle>
            <DialogContent>
                <TextField
                    margin="dense"
                    name="name"
                    label="Sprint Name"
                    type="text"
                    fullWidth
                    value={editedSprint.name}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    name="goal"
                    label="Sprint Goal"
                    type="text"
                    fullWidth
                    value={editedSprint.goal}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    name="startDate"
                    label="Start Date"
                    type="date"
                    fullWidth
                    value={editedSprint.startDate}
                    onChange={handleChange}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <TextField
                    margin="dense"
                    name="endDate"
                    label="End Date"
                    type="date"
                    fullWidth
                    value={editedSprint.endDate}
                    onChange={handleChange}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={() => onSave(editedSprint)} color="primary">Save</Button>
            </DialogActions>
        </Dialog>
    );
}
