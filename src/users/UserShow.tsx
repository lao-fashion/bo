import * as React from 'react';
import {
    Show,
    SimpleShowLayout,
    TextField,
    EmailField,
    BooleanField,
    DateField,
    TopToolbar,
    EditButton,
    DeleteButton,
} from 'react-admin';
import { Box, Typography, Card, CardContent, Grid, Chip } from '@mui/material';

const UserShowActions = () => (
    <TopToolbar>
        <EditButton />
        <DeleteButton />
    </TopToolbar>
);

const UserShow = () => {
    return (
        <Show actions={<UserShowActions />} title="User Details">
            <SimpleShowLayout>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    User Information
                                </Typography>
                                
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <Box>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            Full Name
                                        </Typography>
                                        <TextField source="full_name" variant="h6" />
                                    </Box>
                                    
                                    <Box>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            Username
                                        </Typography>
                                        <TextField source="username" />
                                    </Box>
                                    
                                    <Box>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            Email
                                        </Typography>
                                        <EmailField source="email" />
                                    </Box>
                                    
                                    <Box>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            Phone Number
                                        </Typography>
                                        <TextField source="phone_number" />
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                        
                        <Card sx={{ mt: 2 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Account Status
                                </Typography>
                                
                                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                    <BooleanField
                                        source="verified"
                                        label="Verified"
                                        TrueComponent={() => <Chip label="Verified" color="success" />}
                                        FalseComponent={() => <Chip label="Unverified" color="error" />}
                                    />
                                    
                                    <BooleanField
                                        source="emailVisibility"
                                        label="Email Visibility"
                                        TrueComponent={() => <Chip label="Email Visible" color="primary" />}
                                        FalseComponent={() => <Chip label="Email Hidden" color="default" />}
                                    />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    System Information
                                </Typography>
                                
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <Box>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            User ID
                                        </Typography>
                                        <TextField source="id" />
                                    </Box>
                                    
                                    <Box>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            Collection ID
                                        </Typography>
                                        <TextField source="collectionId" />
                                    </Box>
                                    
                                    <Box>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            Collection Name
                                        </Typography>
                                        <TextField source="collectionName" />
                                    </Box>
                                    
                                    <Box>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            Created
                                        </Typography>
                                        <DateField source="created" showTime />
                                    </Box>
                                    
                                    <Box>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            Last Updated
                                        </Typography>
                                        <DateField source="updated" showTime />
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </SimpleShowLayout>
        </Show>
    );
};

export default UserShow;