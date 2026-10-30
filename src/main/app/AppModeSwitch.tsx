import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import TrainOutlinedIcon from '@mui/icons-material/TrainOutlined';
import { useLocation, useNavigate } from 'react-router-dom';

export function AppModeSwitch() {
  const location = useLocation();
  const navigate = useNavigate();
  const isTimetable = location.pathname.startsWith('/timetable');

  return (
    <ToggleButtonGroup
      exclusive
      fullWidth
      value={isTimetable ? 'timetable' : 'parking'}
      aria-label="Choose Parking or Timetables"
      onChange={(_, value: string | null) => {
        if (value) navigate(value === 'parking' ? '/' : '/timetable');
      }}
      sx={{
        '& .MuiToggleButtonGroup-grouped': {
          border: '0 !important',
          borderRadius: '10px !important',
          textTransform: 'none',
          gap: 1,
          minHeight: 44,
        },
      }}
    >
      <ToggleButton value="parking" aria-label="Parking">
        <DirectionsCarOutlinedIcon />
        Parking
      </ToggleButton>
      <ToggleButton value="timetable" aria-label="Timetables">
        <TrainOutlinedIcon />
        Timetables
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
