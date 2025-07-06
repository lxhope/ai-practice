import { 
  Scene, 
  StandardMaterial, 
  PBRMaterial, 
  Color3, 
  DynamicTexture
} from '@babylonjs/core';
import { WalletComponent } from './WalletArchitecture';

export class MaterialManager {
  private scene: Scene;
  private materials: Map<string, StandardMaterial | PBRMaterial> = new Map();

  constructor(scene: Scene) {
    this.scene = scene;
    this.initializeMaterials();
  }

  private initializeMaterials(): void {
    this.createServerMaterial();
    this.createDatabaseMaterial();
    this.createAPIMaterial();
    this.createSecurityMaterial();
    this.createInterfaceMaterial();
    this.createBlockchainMaterial();
    this.createConnectionMaterial();
  }

  private createServerMaterial(): void {
    const material = new PBRMaterial('serverMaterial', this.scene);
    material.albedoColor = new Color3(0.2, 0.4, 0.8);
    material.metallic = 0.3;
    material.roughness = 0.4;
    material.emissiveColor = new Color3(0.1, 0.2, 0.4);
    material.emissiveIntensity = 0.2;
    
    // 添加发光效果
    const emissiveTexture = new DynamicTexture('serverEmissive', 512, this.scene);
    const context = emissiveTexture.getContext();
    const gradient = context.createLinearGradient(0, 0, 512, 512);
    gradient.addColorStop(0, 'rgba(50, 100, 200, 0.8)');
    gradient.addColorStop(0.5, 'rgba(100, 150, 255, 0.6)');
    gradient.addColorStop(1, 'rgba(50, 100, 200, 0.8)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 512, 512);
    emissiveTexture.update();
    
    material.emissiveTexture = emissiveTexture;
    this.materials.set('server', material);
  }

  private createDatabaseMaterial(): void {
    const material = new PBRMaterial('databaseMaterial', this.scene);
    material.albedoColor = new Color3(0.1, 0.6, 0.2);
    material.metallic = 0.2;
    material.roughness = 0.5;
    material.emissiveColor = new Color3(0.05, 0.3, 0.1);
    material.emissiveIntensity = 0.3;
    
    // 创建数据库条纹纹理
    const stripeTexture = new DynamicTexture('databaseStripe', 512, this.scene);
    const context = stripeTexture.getContext();
    context.fillStyle = '#0a4a1a';
    context.fillRect(0, 0, 512, 512);
    
    for (let i = 0; i < 10; i++) {
      context.fillStyle = i % 2 === 0 ? '#1a8a3a' : '#0a4a1a';
      context.fillRect(0, i * 51, 512, 51);
    }
    stripeTexture.update();
    
    material.albedoTexture = stripeTexture;
    this.materials.set('database', material);
  }

  private createAPIMaterial(): void {
    const material = new PBRMaterial('apiMaterial', this.scene);
    material.albedoColor = new Color3(0.8, 0.4, 0.1);
    material.metallic = 0.6;
    material.roughness = 0.3;
    material.emissiveColor = new Color3(0.4, 0.2, 0.05);
    material.emissiveIntensity = 0.4;
    
    // 创建API网格纹理
    const gridTexture = new DynamicTexture('apiGrid', 512, this.scene);
    const context = gridTexture.getContext();
    context.fillStyle = '#cc6600';
    context.fillRect(0, 0, 512, 512);
    
    context.strokeStyle = '#ff9933';
    context.lineWidth = 2;
    for (let i = 0; i < 512; i += 32) {
      context.beginPath();
      context.moveTo(i, 0);
      context.lineTo(i, 512);
      context.stroke();
      
      context.beginPath();
      context.moveTo(0, i);
      context.lineTo(512, i);
      context.stroke();
    }
    gridTexture.update();
    
    material.albedoTexture = gridTexture;
    this.materials.set('api', material);
  }

  private createSecurityMaterial(): void {
    const material = new PBRMaterial('securityMaterial', this.scene);
    material.albedoColor = new Color3(0.8, 0.1, 0.1);
    material.metallic = 0.8;
    material.roughness = 0.2;
    material.emissiveColor = new Color3(0.4, 0.05, 0.05);
    material.emissiveIntensity = 0.5;
    
    // 创建安全警示纹理
    const warningTexture = new DynamicTexture('securityWarning', 512, this.scene);
    const context = warningTexture.getContext();
    context.fillStyle = '#cc0000';
    context.fillRect(0, 0, 512, 512);
    
    // 添加警示条纹
    context.strokeStyle = '#ff3333';
    context.lineWidth = 8;
    for (let i = 0; i < 512; i += 64) {
      context.beginPath();
      context.moveTo(i, 0);
      context.lineTo(i + 32, 512);
      context.stroke();
    }
    warningTexture.update();
    
    material.albedoTexture = warningTexture;
    this.materials.set('security', material);
  }

  private createInterfaceMaterial(): void {
    const material = new PBRMaterial('interfaceMaterial', this.scene);
    material.albedoColor = new Color3(0.4, 0.2, 0.8);
    material.metallic = 0.1;
    material.roughness = 0.6;
    material.emissiveColor = new Color3(0.2, 0.1, 0.4);
    material.emissiveIntensity = 0.3;
    
    // 创建界面像素纹理
    const pixelTexture = new DynamicTexture('interfacePixel', 512, this.scene);
    const context = pixelTexture.getContext();
    context.fillStyle = '#663399';
    context.fillRect(0, 0, 512, 512);
    
    // 添加像素点
    for (let x = 0; x < 512; x += 16) {
      for (let y = 0; y < 512; y += 16) {
        if (Math.random() > 0.3) {
          context.fillStyle = Math.random() > 0.5 ? '#9966cc' : '#cc99ff';
          context.fillRect(x, y, 8, 8);
        }
      }
    }
    pixelTexture.update();
    
    material.albedoTexture = pixelTexture;
    this.materials.set('interface', material);
  }

  private createBlockchainMaterial(): void {
    const material = new PBRMaterial('blockchainMaterial', this.scene);
    material.albedoColor = new Color3(0.8, 0.6, 0.1);
    material.metallic = 0.9;
    material.roughness = 0.1;
    material.emissiveColor = new Color3(0.4, 0.3, 0.05);
    material.emissiveIntensity = 0.6;
    
    // 创建区块链链条纹理
    const chainTexture = new DynamicTexture('blockchainChain', 512, this.scene);
    const context = chainTexture.getContext();
    context.fillStyle = '#cc9900';
    context.fillRect(0, 0, 512, 512);
    
    // 绘制链条图案
    context.strokeStyle = '#ffcc33';
    context.lineWidth = 4;
    for (let i = 0; i < 512; i += 64) {
      for (let j = 0; j < 512; j += 64) {
        context.beginPath();
        context.arc(i + 32, j + 32, 20, 0, 2 * Math.PI);
        context.stroke();
        
        context.beginPath();
        context.arc(i + 32, j + 32, 12, 0, 2 * Math.PI);
        context.stroke();
      }
    }
    chainTexture.update();
    
    material.albedoTexture = chainTexture;
    this.materials.set('blockchain', material);
  }

  private createConnectionMaterial(): void {
    const material = new StandardMaterial('connectionMaterial', this.scene);
    material.diffuseColor = new Color3(0, 0.8, 1);
    material.emissiveColor = new Color3(0, 0.4, 0.5);
    material.specularColor = new Color3(0, 0.6, 0.8);
    material.alpha = 0.8;
    
    this.materials.set('connection', material);
  }

  public getMaterial(type: WalletComponent['type']): StandardMaterial | PBRMaterial {
    const material = this.materials.get(type);
    if (!material) {
      throw new Error(`Material not found for type: ${type}`);
    }
    return material;
  }

  public getConnectionMaterial(): StandardMaterial | PBRMaterial {
    const material = this.materials.get('connection');
    if (!material) {
      throw new Error('Connection material not found');
    }
    return material;
  }

  public createGlowMaterial(baseColor: Color3, intensity: number = 0.5): StandardMaterial {
    const material = new StandardMaterial('glowMaterial', this.scene);
    material.diffuseColor = baseColor;
    material.emissiveColor = baseColor.scale(intensity);
    material.specularColor = baseColor.scale(0.8);
    material.alpha = 0.9;
    
    return material;
  }

  public createHoverMaterial(baseColor: Color3): StandardMaterial {
    const material = new StandardMaterial('hoverMaterial', this.scene);
    material.diffuseColor = baseColor.scale(1.3);
    material.emissiveColor = baseColor.scale(0.8);
    material.specularColor = new Color3(1, 1, 1);
    material.alpha = 1;
    
    return material;
  }

  public animateMaterial(material: StandardMaterial | PBRMaterial, duration: number = 1000): void {
    const startTime = Date.now();
    const originalEmissive = material.emissiveColor?.clone() || new Color3(0, 0, 0);
    const targetEmissive = originalEmissive.scale(2);
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = 0.5 * (1 + Math.sin(progress * Math.PI * 2 - Math.PI / 2));
      
      if (material.emissiveColor) {
        material.emissiveColor = Color3.Lerp(originalEmissive, targetEmissive, easedProgress);
      }
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        if (material.emissiveColor) {
          material.emissiveColor = originalEmissive;
        }
      }
    };
    
    animate();
  }
}