import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { open } from '@tauri-apps/plugin-dialog';
import { homeDir } from '@tauri-apps/api/path';
import { Folder, RotateCcw, Save } from 'lucide-react';
import { useAppStore } from '../../stores/useAppStore';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';

const schema = z.object({
  savePath: z.string().optional(),
  logsFontSize: z.number(),
  enableNotifications: z.boolean(),
});

type SettingsForm = z.infer<typeof schema>;

const defaultSettings = {
  savePath: '~/Downloads',
  logsFontSize: 16,
  enableNotifications: true,
};

export const SettingsView = () => {
  const [isClickable, setIsClickable] = useState(true);
  const { settings, updateSettings, resetSettings, addLog } = useAppStore();
  
  const form = useForm<SettingsForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      savePath: settings.savePath,
      logsFontSize: settings.logsFontSize,
      enableNotifications: settings.enableNotifications,
    },
  });

  const browse = async () => {
    const selectedDir = await open({
      directory: true,
      multiple: false,
      defaultPath: await homeDir(),
    });

    if (selectedDir) {
      form.setValue('savePath', selectedDir as string);
    }
  };

  const onSubmit: SubmitHandler<SettingsForm> = async (data: SettingsForm) => {
    setIsClickable(false);

    try {
      updateSettings({
        savePath: data.savePath || defaultSettings.savePath,
        logsFontSize: data.logsFontSize,
        enableNotifications: data.enableNotifications,
        theme: settings.theme,
        colorScheme: settings.colorScheme,
      });
      addLog('Settings saved');
      setIsClickable(true);
    } catch (error) {
      addLog(`Error saving settings: ${(error as Error).message}`);
      setIsClickable(true);
      console.error('Error: ', error);
    }
  };

  const onReset = () => {
    try {
      resetSettings();
      form.reset(defaultSettings);
      addLog('Settings restored to their original defaults');
    } catch (error) {
      addLog(`Error resetting settings: ${(error as Error).message}`);
      console.error('Error: ', error);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">Settings</h2>
        <p className="text-muted-foreground">Configure your download preferences</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-6">
              <FormField
                control={form.control}
                name="savePath"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Save to</FormLabel>
                    <div className="flex items-center gap-2">
                      <FormControl>
                        <Input
                          {...field}
                          readOnly
                          className="flex-1 bg-muted"
                          value={field.value || settings.savePath}
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={browse}
                      >
                        <Folder className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => form.setValue('savePath', defaultSettings.savePath)}
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="logsFontSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logs Font Size</FormLabel>
                    <div className="flex items-center gap-2">
                      <FormControl>
                        <Input
                          type="number"
                          min={8}
                          max={32}
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                          className="flex-1"
                          placeholder={settings.logsFontSize.toString()}
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => form.setValue('logsFontSize', defaultSettings.logsFontSize)}
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="enableNotifications"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Enable system notifications (Does not affect in-app notifications)
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={!isClickable}
                className="w-full h-12"
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={onReset}
                className="w-full h-12"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset all settings
              </Button>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
};