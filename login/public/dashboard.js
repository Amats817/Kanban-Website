const modal = document.getElementById('create-board-modal');
const closeBtn = document.querySelector('.close-btn');

closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

const createBoardForm = document.getElementById('create-board-form');
const confirmationMsg = document.getElementById('confirmation-msg');
const errorMsg = document.getElementById('error-msg');

createBoardForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const boardTitle = document.getElementById('board-title').value;
    // You may need to fetch the owner information from the server or use a stored value
    const owner = 'User1'; // Assuming User1 is the owner for now

    if (!boardTitle.trim()) {
        alert('Please enter a board title.');
        return;
    }

    try {
        const response = await fetch('/api/boards', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title: boardTitle, owner: owner })
        });

        if (response.ok) {
            confirmationMsg.style.display = 'block';
            errorMsg.style.display = 'none';
            // Reset form inputs
            document.getElementById('board-title').value = '';
            document.getElementById('board-members').value = '';
        } else {
            throw new Error('Failed to create board.');
        }
    } catch (err) {
        console.error('Error creating board:', err);
        errorMsg.style.display = 'block';
        confirmationMsg.style.display = 'none';
    }
});