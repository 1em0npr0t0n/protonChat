import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { VitePlugin } from '@electron-forge/plugin-vite';
import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { FuseV1Options, FuseVersion } from '@electron/fuses';
import path from 'path';

const config: ForgeConfig = {
  packagerConfig: {
    name: 'Proton Chat',
    icon: path.resolve(__dirname, 'src/public/icon.ico'),
    asar: true,
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({
      // 安装程序图标
      setupIcon: path.resolve(__dirname, 'src/public/icon3.ico'),
      // 安装程序文件名
      setupExe: 'Proton Chat Setup.exe',
      // 不生成 MSI 安装包（只生成 EXE 安装程序）
      noMsi: true,
      // 应用程序包 ID（不能包含空格，必须是有效的 NuGet 包 ID）
      name: 'ProtonChat',
      // 作者信息（可选）
      authors: '一点都不馋',
      // 应用程序描述（可选）
      description: 'Proton Chat - 一款功能强大的聊天应用程序',
      // 加载动画 GIF（可选，如果不想使用默认动画，可以添加自定义 GIF）
      // loadingGif: path.resolve(__dirname, 'src/public/loading.gif'),
    }),
    new MakerZIP({}, ['darwin']),
    // new MakerRpm({}),
    // new MakerDeb({}),
  ],
  plugins: [
    new VitePlugin({
      // `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
      // If you are familiar with Vite configuration, it will look really familiar.
      build: [
        {
          // `entry` is just an alias for `build.lib.entry` in the corresponding file of `config`.
          entry: 'src/main.ts',
          config: 'vite.main.config.ts',
          target: 'main',
        },
        {
          entry: 'src/preload.ts',
          config: 'vite.preload.config.ts',
          target: 'preload',
        },
      ],
      renderer: [
        {
          name: 'main_window',
          config: 'vite.renderer.config.ts',
        },
      ],
    }),
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};

export default config;
