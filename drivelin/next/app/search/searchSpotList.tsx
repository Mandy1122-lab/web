'use client';
import { Box, Container, Typography, Button } from "@mui/material";
import { styled } from '@mui/system';

interface Spot {
  id: number;
  s_name: string;
  s_add: string;
  map: string;
  s_intro: string;
  imageUrl: string;
  coverUrls: string[];
  hours: string;
  tel: string;
  s_tag: string[];
}

const SpotCard = styled(Box)(({ theme }) => ({
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#f9f9f9',
}));

const SpotImage = styled('img')({
  width: '100%',
  height: '150px',
  objectFit: 'cover',
  borderRadius: '8px',
  marginBottom: '8px',
});

const TagContainer = styled(Box)({
  display: 'flex',
  gap: '8px',
  flexWrap: 'wrap',
  marginTop: '8px',
});

const Tag = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(0.5, 1),
  borderRadius: '4px',
  fontSize: '0.8rem',
}));

export default function SearchSpotList({ spots }: { spots: Spot[] }) {
  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        <br> 
        <br> 
        搜尋結果
      </Typography>
      {spots.length > 0 ? (
        spots.map((spot) => (
          <SpotCard key={spot.id}>
            <SpotImage src={spot.imageUrl} alt={spot.s_name} />
            <Typography variant="h6" gutterBottom>
              {spot.s_name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              地址: {spot.s_add}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              營業時間: {spot.hours}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              電話: {spot.tel}
            </Typography>
            <Typography variant="body1" gutterBottom>
              {spot.s_intro}
            </Typography>
            <TagContainer>
              {spot.s_tag.map((tag, index) => (
                <Tag key={index}>{tag}</Tag>
              ))}
            </TagContainer>
            <Box mt={2}>
              <Button
                variant="contained"
                color="primary"
                href={spot.map}
                target="_blank"
                rel="noopener noreferrer"
              >
                查看地圖
              </Button>
            </Box>
          </SpotCard>
        ))
      ) : (
        <Typography variant="body1" color="textSecondary">
        </Typography>
      )}
    </Container>
  );
}
