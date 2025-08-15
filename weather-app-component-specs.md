# Weather App Component Specifications

## 🧩 Component Architecture

### Core Components Hierarchy

```
WeatherApp
├── AppHeader
│   ├── LocationSelector
│   ├── SettingsButton
│   └── SearchOverlay
├── CurrentWeatherHero
│   ├── TemperatureDisplay
│   ├── WeatherIcon
│   ├── ConditionText
│   └── DetailsRow
├── HourlyForecastCarousel
│   └── HourlyWeatherCard[]
├── DailyForecastList
│   └── DailyWeatherCard[]
├── DetailsGrid
│   └── WeatherDetailCard[]
├── RadarMap (optional)
└── AlertBanner
```

## 📱 Component Specifications

### 1. AppHeader Component

**Purpose**: Navigation and location management
**Height**: 56dp on mobile, 64dp on tablet+

```typescript
interface AppHeaderProps {
  currentLocation: Location;
  onLocationChange: (location: Location) => void;
  onSettingsOpen: () => void;
  savedLocations: Location[];
  isSearchOpen: boolean;
}
```

**Visual Specifications**:
- Background: Semi-transparent blur with dynamic weather color
- Location text: 18dp medium weight, tap target 44dp minimum
- Settings icon: 24dp with 12dp padding
- Search icon: 24dp with ripple effect

**Interaction Patterns**:
- Tap location name → Open search overlay
- Tap settings → Slide up settings panel
- Long press location → Quick location switcher

### 2. CurrentWeatherHero Component

**Purpose**: Primary weather information display
**Height**: 240dp on mobile, adaptive on larger screens

```typescript
interface CurrentWeatherHeroProps {
  temperature: number;
  condition: WeatherCondition;
  location: string;
  feelsLike: number;
  highLow: { high: number; low: number };
  precipitationChance: number;
  lastUpdated: Date;
}
```

**Visual Specifications**:
- Temperature: 72dp font, ultra-light weight, center aligned
- Location: 18dp medium, secondary color
- Condition: 16dp regular with weather icon (32dp)
- Feels like: 14dp secondary text
- High/Low: 16dp with visual separators
- Background: Dynamic gradient based on weather/time

**Accessibility Features**:
- Temperature announced as "72 degrees Fahrenheit"
- Condition includes descriptive text for icons
- High contrast mode compatible colors
- Touch target for temperature: 88dp minimum

### 3. HourlyForecastCarousel Component

**Purpose**: Next 24 hours weather preview
**Height**: 120dp

```typescript
interface HourlyForecastCarouselProps {
  hourlyData: HourlyWeather[];
  currentHour: number;
  onHourSelect: (hour: HourlyWeather) => void;
  showPrecipitation: boolean;
}
```

**Visual Specifications**:
- Horizontal scroll with snap-to-grid
- Each hour card: 80dp width, 8dp margin
- Time format: 12/24hr based on locale
- Temperature: 14dp medium
- Icons: 24dp weather condition
- Precipitation: 10dp with blue accent bar

**Interaction Patterns**:
- Horizontal scroll with momentum
- Snap to hour boundaries
- Tap to expand detailed hour view
- Pull indicators at carousel ends

### 4. DailyForecastList Component

**Purpose**: 7-10 day weather forecast
**Height**: Flexible, minimum 56dp per item

```typescript
interface DailyForecastListProps {
  dailyData: DailyWeather[];
  expandedDay?: number;
  onDayExpand: (dayIndex: number) => void;
  showDetails: boolean;
}
```

**Visual Specifications**:
- Day name: 16dp medium, left aligned
- Weather icon: 32dp, centered
- High temp: 16dp bold, right aligned
- Low temp: 16dp regular, muted color
- Precipitation: 12dp with percentage
- Dividers: 1dp subtle lines

**States**:
- Default: Collapsed view
- Expanded: Shows hourly breakdown for selected day
- Loading: Skeleton animation
- Error: Retry option with error message

### 5. DetailsGrid Component

**Purpose**: Additional weather metrics
**Layout**: 2x3 grid on mobile, 3x2 on tablet+

```typescript
interface DetailsGridProps {
  details: {
    feelsLike: number;
    humidity: number;
    uvIndex: number;
    visibility: number;
    pressure: number;
    sunrise: Date;
    sunset: Date;
    windSpeed: number;
    windDirection: number;
  };
  units: 'metric' | 'imperial';
}
```

**Visual Specifications**:
- Grid items: 16dp border radius, subtle shadow
- Label: 12dp secondary color, uppercase
- Value: 20dp primary color, bold
- Icon: 16dp accent color
- Background: Semi-transparent cards

### 6. WeatherIcon Component

**Purpose**: Animated weather condition visualization

```typescript
interface WeatherIconProps {
  condition: WeatherCondition;
  size: 'small' | 'medium' | 'large' | 'hero';
  animated?: boolean;
  timeOfDay: 'day' | 'night';
}

type WeatherCondition = 
  | 'clear' | 'partly-cloudy' | 'cloudy' | 'overcast'
  | 'light-rain' | 'rain' | 'heavy-rain' | 'thunderstorm'
  | 'snow' | 'sleet' | 'fog' | 'windy';
```

**Animation Specifications**:
- Clear: Subtle sun ray rotation (15s duration)
- Cloudy: Gentle cloud drift (20s duration)  
- Rain: Falling droplet animation (2s loop)
- Storm: Lightning flash with delay (5s interval)
- Snow: Snowflake drift animation (8s duration)
- Reduced motion: Static icons with subtle pulse

### 7. SearchOverlay Component

**Purpose**: Location search and selection
**Type**: Full-screen modal overlay

```typescript
interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (location: Location) => void;
  recentSearches: Location[];
  savedLocations: Location[];
  currentLocation?: Location;
}
```

**Visual Specifications**:
- Background: 90% opacity dark backdrop
- Search bar: 48dp height, rounded corners
- Results: List items 56dp height
- Current location: GPS icon with loading animation
- Recent/saved: Section headers with icons

**Interaction Patterns**:
- Swipe down to dismiss
- Tap outside to close
- Keyboard navigation support
- Voice search integration

### 8. AlertBanner Component

**Purpose**: Weather warnings and notifications
**Position**: Top of screen, below header

```typescript
interface AlertBannerProps {
  alert: WeatherAlert;
  onDismiss: () => void;
  severity: 'info' | 'warning' | 'severe';
  autoHide?: boolean;
}
```

**Visual Specifications**:
- Background colors: Info (blue), Warning (orange), Severe (red)
- Text: 14dp medium, high contrast
- Icon: 20dp warning/info symbol
- Dismiss: X button with 44dp touch target
- Animation: Slide down entrance, fade out exit

## 🎨 Design Tokens

### Spacing Scale
```css
--space-micro: 4px;
--space-small: 8px;
--space-medium: 16px;
--space-large: 24px;
--space-xl: 32px;
--space-xxl: 48px;
```

### Color Tokens
```css
:root {
  /* Primary Colors */
  --color-primary: #4A90E2;
  --color-primary-dark: #357ABD;
  --color-primary-light: #7BB0E8;
  
  /* Weather Condition Colors */
  --color-sunny: #FFD700;
  --color-cloudy: #87CEEB;
  --color-rainy: #4682B4;
  --color-stormy: #2F4F4F;
  --color-snowy: #F0F8FF;
  
  /* Semantic Colors */
  --color-success: #28A745;
  --color-warning: #FFC107;
  --color-error: #DC3545;
  --color-info: #17A2B8;
  
  /* Neutral Colors */
  --color-text-primary: #212529;
  --color-text-secondary: #6C757D;
  --color-background: #F8F9FA;
  --color-surface: #FFFFFF;
  --color-border: #E9ECEF;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-text-primary: #F8F9FA;
    --color-text-secondary: #ADB5BD;
    --color-background: #121212;
    --color-surface: #1E1E1E;
    --color-border: #343A40;
  }
}
```

### Typography Tokens
```css
:root {
  --font-family-primary: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-family-mono: 'SF Mono', Monaco, 'Cascadia Code', monospace;
  
  /* Font Sizes */
  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-base: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 20px;
  --font-size-2xl: 24px;
  --font-size-hero: 72px;
  
  /* Font Weights */
  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
}
```

### Shadow Tokens
```css
:root {
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-base: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}
```

### Border Radius Tokens
```css
:root {
  --radius-sm: 4px;
  --radius-base: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-full: 9999px;
}
```

## 🔧 Component States

### Loading States
- **Skeleton**: Animated placeholder matching component structure
- **Shimmer**: Gentle animation indicating loading progress
- **Spinner**: For quick operations (<2s expected)
- **Progressive**: Content loads in priority order

### Error States
- **Retry**: Clear error message with retry button
- **Fallback**: Graceful degradation with alternative content
- **Offline**: Cached content with offline indicator
- **Empty**: No data available with helpful guidance

### Interactive States
- **Default**: Base appearance
- **Hover**: Subtle highlight (desktop)
- **Focus**: Clear focus indicator for keyboard navigation
- **Active**: Pressed/selected state
- **Disabled**: Reduced opacity with cursor change

## 📱 Responsive Behavior

### Breakpoint Strategy
```css
/* Mobile First Approach */
.component {
  /* Base styles for mobile */
}

@media (min-width: 768px) {
  /* Tablet styles */
}

@media (min-width: 1024px) {
  /* Desktop styles */
}

@media (min-width: 1440px) {
  /* Large desktop styles */
}
```

### Component Adaptation Rules
1. **Touch targets**: Minimum 44dp on all screen sizes
2. **Font scaling**: Responsive typography using clamp()
3. **Grid adaptation**: Flexible grid columns based on available space
4. **Content priority**: Hide less important elements on smaller screens
5. **Navigation patterns**: Tab bar mobile → sidebar desktop

## ⚡ Performance Optimization

### Component Loading Strategy
1. **Critical path**: Current weather loads first
2. **Progressive enhancement**: Additional features load after core
3. **Code splitting**: Components loaded on demand
4. **Prefetching**: Predict user actions and preload content
5. **Caching**: Aggressive caching of component templates

### Animation Performance
- Use CSS transforms for animations
- Prefer opacity and transform changes
- Avoid layout-triggering properties
- Use will-change for complex animations
- Implement reduced-motion preferences

This comprehensive component specification provides the frontend developer with clear implementation guidelines while maintaining consistency with the UX design principles.