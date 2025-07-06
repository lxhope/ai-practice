import { 
  Scene, 
  Vector3, 
  MeshBuilder, 
  Mesh, 
  Animation, 
  ParticleSystem,
  Color4,
  Texture
} from '@babylonjs/core';
import { MaterialManager } from './MaterialManager';

export interface WalletComponent {
  mesh: Mesh;
  name: string;
  description: string;
  connections: string[];
  position: Vector3;
  type: 'server' | 'database' | 'api' | 'security' | 'interface' | 'blockchain';
}

export class WalletArchitecture {
  private scene: Scene;
  private materialManager: MaterialManager;
  private components: Map<string, WalletComponent> = new Map();
  private connectionLines: Mesh[] = [];
  private dataFlowParticles: ParticleSystem[] = [];

  constructor(scene: Scene, materialManager: MaterialManager) {
    this.scene = scene;
    this.materialManager = materialManager;
  }

  public createWalletComponents(): void {
    this.createCoreComponents();
    this.createSecurityLayer();
    this.createDatabaseLayer();
    this.createAPILayer();
    this.createUserInterface();
    this.createBlockchainLayer();
  }

  private createCoreComponents(): void {
    // 核心服务器
    const coreServer = this.createComponent(
      'coreServer',
      'server',
      '核心服务器',
      '处理所有钱包业务逻辑和交易',
      new Vector3(0, 0, 0),
      { width: 3, height: 2, depth: 3 }
    );
    
    // 负载均衡器
    const loadBalancer = this.createComponent(
      'loadBalancer',
      'server',
      '负载均衡器',
      '分发请求到多个服务实例',
      new Vector3(-6, 2, 0),
      { width: 2, height: 1.5, depth: 2 }
    );

    // 缓存层
    const cacheLayer = this.createComponent(
      'cacheLayer',
      'database',
      '缓存层',
      'Redis缓存提升响应速度',
      new Vector3(6, 1, 0),
      { width: 2.5, height: 1, depth: 2.5 }
    );

    this.components.set('coreServer', {
      mesh: coreServer,
      name: '核心服务器',
      description: '处理所有钱包业务逻辑和交易',
      connections: ['loadBalancer', 'cacheLayer', 'database'],
      position: new Vector3(0, 0, 0),
      type: 'server'
    });

    this.components.set('loadBalancer', {
      mesh: loadBalancer,
      name: '负载均衡器',
      description: '分发请求到多个服务实例',
      connections: ['coreServer'],
      position: new Vector3(-6, 2, 0),
      type: 'server'
    });

    this.components.set('cacheLayer', {
      mesh: cacheLayer,
      name: '缓存层',
      description: 'Redis缓存提升响应速度',
      connections: ['coreServer'],
      position: new Vector3(6, 1, 0),
      type: 'database'
    });
  }

  private createSecurityLayer(): void {
    // HSM硬件安全模块
    const hsm = this.createComponent(
      'hsm',
      'security',
      'HSM安全模块',
      '硬件级别的密钥管理和加密',
      new Vector3(-4, -3, 4),
      { width: 2, height: 1.5, depth: 2 }
    );

    // 多重签名服务
    const multiSig = this.createComponent(
      'multiSig',
      'security',
      '多重签名',
      '多重签名验证服务',
      new Vector3(0, -3, 4),
      { width: 2, height: 1.5, depth: 2 }
    );

    // 风控系统
    const riskControl = this.createComponent(
      'riskControl',
      'security',
      '风控系统',
      '实时风险监控和预警',
      new Vector3(4, -3, 4),
      { width: 2, height: 1.5, depth: 2 }
    );

    this.components.set('hsm', {
      mesh: hsm,
      name: 'HSM安全模块',
      description: '硬件级别的密钥管理和加密',
      connections: ['coreServer', 'multiSig'],
      position: new Vector3(-4, -3, 4),
      type: 'security'
    });

    this.components.set('multiSig', {
      mesh: multiSig,
      name: '多重签名',
      description: '多重签名验证服务',
      connections: ['coreServer', 'hsm'],
      position: new Vector3(0, -3, 4),
      type: 'security'
    });

    this.components.set('riskControl', {
      mesh: riskControl,
      name: '风控系统',
      description: '实时风险监控和预警',
      connections: ['coreServer'],
      position: new Vector3(4, -3, 4),
      type: 'security'
    });
  }

  private createDatabaseLayer(): void {
    // 主数据库
    const database = this.createComponent(
      'database',
      'database',
      '主数据库',
      '存储用户和交易数据',
      new Vector3(0, -6, 0),
      { width: 4, height: 2, depth: 4 }
    );

    // 备份数据库
    const backupDB = this.createComponent(
      'backupDB',
      'database',
      '备份数据库',
      '数据备份和灾难恢复',
      new Vector3(8, -6, 0),
      { width: 3, height: 1.5, depth: 3 }
    );

    // 审计日志
    const auditLog = this.createComponent(
      'auditLog',
      'database',
      '审计日志',
      '记录所有操作日志',
      new Vector3(-8, -6, 0),
      { width: 2.5, height: 1, depth: 2.5 }
    );

    this.components.set('database', {
      mesh: database,
      name: '主数据库',
      description: '存储用户和交易数据',
      connections: ['coreServer', 'backupDB'],
      position: new Vector3(0, -6, 0),
      type: 'database'
    });

    this.components.set('backupDB', {
      mesh: backupDB,
      name: '备份数据库',
      description: '数据备份和灾难恢复',
      connections: ['database'],
      position: new Vector3(8, -6, 0),
      type: 'database'
    });

    this.components.set('auditLog', {
      mesh: auditLog,
      name: '审计日志',
      description: '记录所有操作日志',
      connections: ['coreServer'],
      position: new Vector3(-8, -6, 0),
      type: 'database'
    });
  }

  private createAPILayer(): void {
    // API网关
    const apiGateway = this.createComponent(
      'apiGateway',
      'api',
      'API网关',
      '统一API入口和管理',
      new Vector3(0, 4, 0),
      { width: 3, height: 1.5, depth: 3 }
    );

    // 用户API
    const userAPI = this.createComponent(
      'userAPI',
      'api',
      '用户API',
      '用户相关接口服务',
      new Vector3(-4, 4, -4),
      { width: 2, height: 1, depth: 2 }
    );

    // 交易API
    const transactionAPI = this.createComponent(
      'transactionAPI',
      'api',
      '交易API',
      '交易相关接口服务',
      new Vector3(4, 4, -4),
      { width: 2, height: 1, depth: 2 }
    );

    this.components.set('apiGateway', {
      mesh: apiGateway,
      name: 'API网关',
      description: '统一API入口和管理',
      connections: ['loadBalancer', 'userAPI', 'transactionAPI'],
      position: new Vector3(0, 4, 0),
      type: 'api'
    });

    this.components.set('userAPI', {
      mesh: userAPI,
      name: '用户API',
      description: '用户相关接口服务',
      connections: ['apiGateway'],
      position: new Vector3(-4, 4, -4),
      type: 'api'
    });

    this.components.set('transactionAPI', {
      mesh: transactionAPI,
      name: '交易API',
      description: '交易相关接口服务',
      connections: ['apiGateway'],
      position: new Vector3(4, 4, -4),
      type: 'api'
    });
  }

  private createUserInterface(): void {
    // Web界面
    const webUI = this.createComponent(
      'webUI',
      'interface',
      'Web界面',
      '网页版钱包界面',
      new Vector3(-6, 8, 0),
      { width: 2.5, height: 0.5, depth: 4 }
    );

    // 移动端APP
    const mobileApp = this.createComponent(
      'mobileApp',
      'interface',
      '移动端APP',
      '手机钱包应用',
      new Vector3(0, 8, 0),
      { width: 1.5, height: 0.5, depth: 3 }
    );

    // 管理后台
    const adminPanel = this.createComponent(
      'adminPanel',
      'interface',
      '管理后台',
      '管理员操作界面',
      new Vector3(6, 8, 0),
      { width: 2.5, height: 0.5, depth: 4 }
    );

    this.components.set('webUI', {
      mesh: webUI,
      name: 'Web界面',
      description: '网页版钱包界面',
      connections: ['apiGateway'],
      position: new Vector3(-6, 8, 0),
      type: 'interface'
    });

    this.components.set('mobileApp', {
      mesh: mobileApp,
      name: '移动端APP',
      description: '手机钱包应用',
      connections: ['apiGateway'],
      position: new Vector3(0, 8, 0),
      type: 'interface'
    });

    this.components.set('adminPanel', {
      mesh: adminPanel,
      name: '管理后台',
      description: '管理员操作界面',
      connections: ['apiGateway'],
      position: new Vector3(6, 8, 0),
      type: 'interface'
    });
  }

  private createBlockchainLayer(): void {
    // 区块链节点
    const blockchainNode = this.createComponent(
      'blockchainNode',
      'blockchain',
      '区块链节点',
      '连接到区块链网络',
      new Vector3(0, 0, -8),
      { width: 2.5, height: 2.5, depth: 2.5 }
    );

    // 智能合约
    const smartContract = this.createComponent(
      'smartContract',
      'blockchain',
      '智能合约',
      '自动执行的合约逻辑',
      new Vector3(-4, 0, -8),
      { width: 2, height: 2, depth: 2 }
    );

    // 跨链桥
    const crossChain = this.createComponent(
      'crossChain',
      'blockchain',
      '跨链桥',
      '连接多个区块链网络',
      new Vector3(4, 0, -8),
      { width: 2, height: 2, depth: 2 }
    );

    this.components.set('blockchainNode', {
      mesh: blockchainNode,
      name: '区块链节点',
      description: '连接到区块链网络',
      connections: ['coreServer'],
      position: new Vector3(0, 0, -8),
      type: 'blockchain'
    });

    this.components.set('smartContract', {
      mesh: smartContract,
      name: '智能合约',
      description: '自动执行的合约逻辑',
      connections: ['blockchainNode'],
      position: new Vector3(-4, 0, -8),
      type: 'blockchain'
    });

    this.components.set('crossChain', {
      mesh: crossChain,
      name: '跨链桥',
      description: '连接多个区块链网络',
      connections: ['blockchainNode'],
      position: new Vector3(4, 0, -8),
      type: 'blockchain'
    });
  }

  private createComponent(
    id: string,
    type: WalletComponent['type'],
    _name: string,
    _description: string,
    position: Vector3,
    size: { width: number; height: number; depth: number }
  ): Mesh {
    let mesh: Mesh;
    
    switch (type) {
      case 'server':
        mesh = MeshBuilder.CreateBox(id, size, this.scene);
        break;
      case 'database':
        mesh = MeshBuilder.CreateCylinder(id, { 
          height: size.height, 
          diameterTop: size.width, 
          diameterBottom: size.width 
        }, this.scene);
        break;
      case 'api':
        mesh = MeshBuilder.CreateSphere(id, { diameter: size.width }, this.scene);
        break;
      case 'security':
        mesh = MeshBuilder.CreatePolyhedron(id, { size: size.width }, this.scene);
        break;
      case 'interface':
        mesh = MeshBuilder.CreateBox(id, size, this.scene);
        break;
      case 'blockchain':
        mesh = MeshBuilder.CreateIcoSphere(id, { radius: size.width / 2 }, this.scene);
        break;
      default:
        mesh = MeshBuilder.CreateBox(id, size, this.scene);
    }

    mesh.position = position;
    mesh.material = this.materialManager.getMaterial(type);
    
    // 添加浮动动画
    this.addFloatingAnimation(mesh);
    
    return mesh;
  }

  private addFloatingAnimation(mesh: Mesh): void {
    const animationY = new Animation(
      'floatingAnimation',
      'position.y',
      30,
      Animation.ANIMATIONTYPE_FLOAT,
      Animation.ANIMATIONLOOPMODE_CYCLE
    );

    const keys = [];
    keys.push({ frame: 0, value: mesh.position.y });
    keys.push({ frame: 60, value: mesh.position.y + 0.2 });
    keys.push({ frame: 120, value: mesh.position.y });

    animationY.setKeys(keys);
    mesh.animations.push(animationY);
    
    this.scene.beginAnimation(mesh, 0, 120, true);
  }

  public createConnectionLines(): void {
    this.components.forEach((component) => {
      component.connections.forEach(connectionId => {
        const targetComponent = this.components.get(connectionId);
        if (targetComponent) {
          const line = this.createConnectionLine(component.position, targetComponent.position);
          this.connectionLines.push(line);
        }
      });
    });
  }

  private createConnectionLine(start: Vector3, end: Vector3): Mesh {
    const line = MeshBuilder.CreateLines('connectionLine', {
      points: [start, end]
    }, this.scene);
    
    line.material = this.materialManager.getConnectionMaterial();
    line.isPickable = false;
    
    return line;
  }

  public createDataFlow(): void {
    this.components.forEach((component) => {
      if (component.type === 'server' || component.type === 'api') {
        const particles = this.createParticleSystem(component.position);
        this.dataFlowParticles.push(particles);
      }
    });
  }

  private createParticleSystem(position: Vector3): ParticleSystem {
    const particleSystem = new ParticleSystem('dataFlow', 50, this.scene);
    
    particleSystem.particleTexture = new Texture('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHZpZXdCb3g9IjAgMCAxMCAxMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNSIgY3k9IjUiIHI9IjUiIGZpbGw9IiMwMGQ0ZmYiLz4KPC9zdmc+', this.scene);
    
    particleSystem.emitter = position;
    particleSystem.minEmitBox = new Vector3(-0.5, -0.5, -0.5);
    particleSystem.maxEmitBox = new Vector3(0.5, 0.5, 0.5);
    
    particleSystem.color1 = new Color4(0, 0.8, 1, 1);
    particleSystem.color2 = new Color4(0.2, 0.6, 1, 1);
    particleSystem.colorDead = new Color4(0, 0, 0, 0);
    
    particleSystem.minSize = 0.1;
    particleSystem.maxSize = 0.3;
    
    particleSystem.minLifeTime = 1;
    particleSystem.maxLifeTime = 3;
    
    particleSystem.emitRate = 10;
    
    particleSystem.direction1 = new Vector3(-1, 1, -1);
    particleSystem.direction2 = new Vector3(1, 1, 1);
    
    particleSystem.minEmitPower = 0.5;
    particleSystem.maxEmitPower = 1.5;
    
    particleSystem.gravity = new Vector3(0, -0.5, 0);
    
    particleSystem.start();
    
    return particleSystem;
  }

  public getComponents(): Map<string, WalletComponent> {
    return this.components;
  }

  public getComponentByMesh(mesh: Mesh): WalletComponent | undefined {
    for (const [, component] of this.components) {
      if (component.mesh === mesh) {
        return component;
      }
    }
    return undefined;
  }
}