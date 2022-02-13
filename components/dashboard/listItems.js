import * as React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import useTranslation from 'next-translate/useTranslation'
import Link from '@src/Link';

export const MainListItems = () => {
  const { t, lang } = useTranslation('common')
  return (
    <div>
      <Link 
        href='/'
        sx={{ 
            color: 'black', 
            opacity: 0.7,
            textDecoration: 'none'
          }}
      >
        <ListItem button>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary={t('Dashboard')} />
        </ListItem>
      </Link>
      <Link 
        href='/calendar'
        sx={{ 
            color: 'black', 
            opacity: 0.7,
            textDecoration: 'none'
          }}
      >
        <ListItem button>
          <ListItemIcon>
            <CalendarTodayIcon />
          </ListItemIcon>
          <ListItemText primary={t('Calendar')} />
        </ListItem>
      </Link>
      <Link 
        href='/datatable'
        sx={{ 
            color: 'black', 
            opacity: 0.7,
            textDecoration: 'none'
          }}
      >
        <ListItem button>
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary={t('Customers')} />
        </ListItem>
      </Link>
      <Link 
        href='/examples'
        sx={{ 
            color: 'black', 
            opacity: 0.7,
            textDecoration: 'none'
          }}
      >
        <ListItem button>
          <ListItemIcon>
            <BarChartIcon />
          </ListItemIcon>
          <ListItemText primary={t('Reports')} />
        </ListItem>
      </Link>
    </div>
  );
};

export const secondaryListItems = (
  <div>
    <ListSubheader inset>Saved reports</ListSubheader>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Current month" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Last quarter" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Year-end sale" />
    </ListItem>
  </div>
);
