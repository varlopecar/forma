import * as ProgressPrimitive from '@rn-primitives/progress';
import * as React from 'react';
import { Platform, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
} from 'react-native-reanimated';
import { cn } from '~/lib/utils';

const Progress = React.forwardRef<
  ProgressPrimitive.RootRef,
  ProgressPrimitive.RootProps & {
    indicatorClassName?: string;
    indicatorColor?: string;
  }
>(({ className, value, indicatorClassName, indicatorColor, ...props }, ref) => {
  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn('relative h-4 w-full overflow-hidden rounded-full', className)}
      {...props}
    >
      <Indicator value={value} className={indicatorClassName} indicatorColor={indicatorColor} />
    </ProgressPrimitive.Root>
  );
});
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };

function Indicator({
  value,
  className,
  indicatorColor
}: {
  value: number | undefined | null;
  className?: string;
  indicatorColor?: string;
}) {
  const progress = useDerivedValue(() => value ?? 0);

  const indicator = useAnimatedStyle(() => {
    return {
      width: `${interpolate(progress.value, [0, 100], [0, 100], Extrapolation.CLAMP)}%`,
      backgroundColor: indicatorColor || '#000',
    };
  });

  if (Platform.OS === 'web') {
    return (
      <View
        className={cn('h-full w-full flex-1', className)}
        style={{
          width: `${value ?? 0}%`,
          backgroundColor: indicatorColor || '#000'
        }}
      >
        <ProgressPrimitive.Indicator className={cn('h-full w-full', className)} />
      </View>
    );
  }

  return (
    <ProgressPrimitive.Indicator asChild>
      <Animated.View
        style={[indicator]}
        className={cn('h-full', className)}
      />
    </ProgressPrimitive.Indicator>
  );
}
