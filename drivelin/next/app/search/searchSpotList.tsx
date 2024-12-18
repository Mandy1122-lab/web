'use client';
import { Box, Container, Typography } from "@mui/material";

interface Spot {
  id: number;
  s_name: string;
  s_add: string;
  imageUrl: string;
}

interface SearchSpotListProps {
  spots: Spot[];
  isQueried: boolean;
}

export default function searchSpotList({ spots, isQueried }: SearchSpotListProps) {
  return (
    <Container maxWidth="sm">
      <Box>
        {!isQueried ? null : spots.length === 0 ? (
          <Typography variant="h6" color="error">查無結果</Typography>
        ) : (
          spots.map((spot) => (
            <Box key={spot.id} sx={{ mb: 3 }}>
              <Typography variant="h6">{spot.s_name}</Typography>
              <Typography variant="body2">{spot.s_add}</Typography>
              {/* 圖片 */}
              {spot.imageUrl && <img src={spot.imageUrl} alt={spot.s_name} style={{ width: '200px', height: '150px' }} />}
            </Box>
          ))
        )}
      </Box>
    </Container>
  );
}
