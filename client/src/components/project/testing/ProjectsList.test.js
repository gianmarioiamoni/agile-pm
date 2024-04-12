import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ProjectsList from '../ProjectsList';

test('renders ProjectsList with Edit button disabled for non-authorized user', () => {
    const projects = [{ id: 1, name: 'Project 1', description: 'Description 1' }];
    const onEdit = jest.fn();
    const onDelete = jest.fn();
    const isEditable = false; // Simulate non-authorized user

    const { getByText, queryByLabelText } = render(
        <ProjectsList projects={projects} onEdit={onEdit} onDelete={onDelete} isEditable={isEditable} />
    );

    // Verifica che il pulsante di modifica sia disabilitato
    const editButton = queryByLabelText('Edit');
    expect(editButton).toBeInTheDocument();
    expect(editButton).toBeDisabled();
});
