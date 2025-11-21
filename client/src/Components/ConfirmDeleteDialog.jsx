import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";

export default function ConfirmDeleteDialog({ open, onClose, onConfirm, game }) {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle>Delete game</DialogTitle>
            <DialogContent>
                <Typography>
                    Are you sure you want to delete
                    {game ? ` "${game.titre}"` : ""}?
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button color="error" variant="contained" onClick={onConfirm}>
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
}
