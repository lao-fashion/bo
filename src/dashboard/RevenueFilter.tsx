import React, { useState } from 'react';
import {
  Box,
  FormControlLabel,
  Checkbox,
  TextField,
  IconButton,
  Collapse,
  Typography,
} from '@mui/material';
import { FilterList, Close } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';

interface FilterParams {
  isYear: boolean;
  startDate?: string;
  endDate?: string;
}

interface Props {
  onFilterChange: (params: FilterParams) => void;
}

const RevenueFilter: React.FC<Props> = ({ onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMonthChecked, setIsMonthChecked] = useState(false);
  const [isYearChecked, setIsYearChecked] = useState(false);
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs().subtract(30, 'day'));
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());

  const handleMonthCheck = (checked: boolean) => {
    setIsMonthChecked(checked);
    if (checked) {
      setIsYearChecked(false);
    }
    onFilterChange({
      isYear: checked ? false : isYearChecked,
      startDate: startDate?.format('YYYY-MM-DD'),
      endDate: endDate?.format('YYYY-MM-DD'),
    });
  };

  const handleYearCheck = (checked: boolean) => {
    setIsYearChecked(checked);
    if (checked) {
      setIsMonthChecked(false);
    }
    onFilterChange({
      isYear: checked ? true : false,
      startDate: startDate?.format('YYYY-MM-DD'),
      endDate: endDate?.format('YYYY-MM-DD'),
    });
  };

  const handleDateChange = () => {
    if (startDate && endDate) {
      onFilterChange({
        isYear: isYearChecked,
        startDate: startDate.format('YYYY-MM-DD'),
        endDate: endDate.format('YYYY-MM-DD'),
      });
    }
  };

  React.useEffect(() => {
    handleDateChange();
  }, [startDate, endDate, isYearChecked]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ position: 'relative' }}>
        <IconButton
          onClick={() => setIsOpen(!isOpen)}
          sx={{ 
            color: '#666',
            border: '1px solid #e0e0e0',
            borderRadius: 1,
            p: 1,
          }}
        >
          {isOpen ? <Close /> : <FilterList />}
        </IconButton>

        <Collapse in={isOpen}>
          <Box
            sx={{
              position: 'absolute',
              top: '100%',
              right: 0,
              mt: 1,
              p: 2,
              bgcolor: 'white',
              border: '1px solid #e0e0e0',
              borderRadius: 2,
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              minWidth: 320,
              zIndex: 1000,
            }}
          >
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              Filter Options
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isMonthChecked}
                    onChange={(e) => handleMonthCheck(e.target.checked)}
                  />
                }
                label="Month"
              />
              
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isYearChecked}
                    onChange={(e) => handleYearCheck(e.target.checked)}
                  />
                }
                label="Year"
              />

              <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, fontWeight: 600 }}>
                Date Range
              </Typography>
              
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                slotProps={{ textField: { size: 'small' } }}
              />
              
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                slotProps={{ textField: { size: 'small' } }}
              />
            </Box>
          </Box>
        </Collapse>
      </Box>
    </LocalizationProvider>
  );
};

export default RevenueFilter;