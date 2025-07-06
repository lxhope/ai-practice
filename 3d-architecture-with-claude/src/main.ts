import { WalletVisualization } from './WalletVisualization';

class App {
  private visualization: WalletVisualization | null = null;

  constructor() {
    this.init();
  }

  private async init(): Promise<void> {
    try {
      const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
      if (!canvas) {
        throw new Error('Canvas element not found');
      }

      // 创建3D钱包架构可视化
      this.visualization = new WalletVisualization(canvas);
      
      console.log('3D托管钱包架构图已成功加载');
    } catch (error) {
      console.error('初始化失败:', error);
      this.showError('初始化失败，请刷新页面重试');
    }
  }

  private showError(message: string): void {
    const loading = document.getElementById('loading');
    if (loading) {
      loading.textContent = message;
      loading.style.color = '#ff6b6b';
    }
  }

  public dispose(): void {
    if (this.visualization) {
      this.visualization.dispose();
      this.visualization = null;
    }
  }
}

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', () => {
  // 创建应用实例
  const app = new App();
  
  // 页面卸载时清理资源
  window.addEventListener('beforeunload', () => {
    app.dispose();
  });
});

export default App;