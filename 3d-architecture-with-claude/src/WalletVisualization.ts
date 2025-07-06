import { Engine, Scene, Vector3, HemisphericLight, MeshBuilder, StandardMaterial, Color3, ArcRotateCamera, DirectionalLight, ShadowGenerator, HighlightLayer, GlowLayer, Color4, ActionManager, ExecuteCodeAction, Animation } from '@babylonjs/core';

export class WalletVisualization {
  private engine!: Engine;
  private scene!: Scene;
  private camera!: ArcRotateCamera;
  private highlightLayer!: HighlightLayer;
  private glowLayer!: GlowLayer;
  private components: Map<string, any> = new Map();
  private isAutoRotating = false;

  constructor(canvas: HTMLCanvasElement) {
    try {
      this.engine = new Engine(canvas, true);
      this.scene = new Scene(this.engine);
      this.setupCamera(canvas);
      this.setupLighting();
      this.setupEnvironment();
      this.setupPostProcessing();
      this.createComponents();
      this.setupInteractions();
      this.setupControls();
      this.startRenderLoop();
      this.hideLoading();
    } catch (error) {
      console.error('Initialization failed:', error);
      this.showError('初始化失败，请刷新页面重试');
    }
  }

  private setupCamera(canvas: HTMLCanvasElement): void {
    this.camera = new ArcRotateCamera('camera', -Math.PI / 2, Math.PI / 3, 25, Vector3.Zero(), this.scene);
    this.camera.setTarget(Vector3.Zero());
    this.camera.attachControl(canvas);
    this.camera.lowerRadiusLimit = 8;
    this.camera.upperRadiusLimit = 50;
  }

  private setupLighting(): void {
    const ambientLight = new HemisphericLight('ambientLight', new Vector3(0, 1, 0), this.scene);
    ambientLight.intensity = 0.3;

    const directionalLight = new DirectionalLight('directionalLight', new Vector3(-1, -1, -1), this.scene);
    directionalLight.intensity = 0.8;
    directionalLight.position = new Vector3(10, 10, 10);

    const shadowGenerator = new ShadowGenerator(2048, directionalLight);
    shadowGenerator.useBlurExponentialShadowMap = true;
  }

  private setupEnvironment(): void {
    this.scene.clearColor = new Color4(0.02, 0.02, 0.08, 1);
    
    const skybox = MeshBuilder.CreateSphere('skybox', { diameter: 100 }, this.scene);
    const skyboxMaterial = new StandardMaterial('skyboxMaterial', this.scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.emissiveColor = new Color3(0.05, 0.05, 0.15);
    skybox.material = skyboxMaterial;
    skybox.infiniteDistance = true;
  }

  private setupPostProcessing(): void {
    this.highlightLayer = new HighlightLayer('highlightLayer', this.scene);
    this.glowLayer = new GlowLayer('glowLayer', this.scene);
    this.glowLayer.intensity = 0.5;
  }

  private createComponents(): void {
    // 核心服务器
    this.createComponent('核心服务器', new Vector3(0, 0, 0), 'server');
    // 数据库
    this.createComponent('数据库', new Vector3(0, -4, 0), 'database');
    // API网关
    this.createComponent('API网关', new Vector3(0, 4, 0), 'api');
    // 安全模块
    this.createComponent('安全模块', new Vector3(-4, 0, 4), 'security');
    // 区块链节点
    this.createComponent('区块链节点', new Vector3(0, 0, -6), 'blockchain');
    // 用户界面
    this.createComponent('用户界面', new Vector3(0, 8, 0), 'interface');

    // 连接线
    this.createConnectionLines();
  }

  private createComponent(name: string, position: Vector3, type: string): any {
    let mesh;
    const material = new StandardMaterial(name + 'Material', this.scene);
    
    switch (type) {
      case 'server':
        mesh = MeshBuilder.CreateBox(name, { size: 2 }, this.scene);
        material.diffuseColor = new Color3(0.2, 0.4, 0.8);
        material.emissiveColor = new Color3(0.1, 0.2, 0.4);
        break;
      case 'database':
        mesh = MeshBuilder.CreateCylinder(name, { height: 2, diameter: 2 }, this.scene);
        material.diffuseColor = new Color3(0.1, 0.6, 0.2);
        material.emissiveColor = new Color3(0.05, 0.3, 0.1);
        break;
      case 'api':
        mesh = MeshBuilder.CreateSphere(name, { diameter: 2 }, this.scene);
        material.diffuseColor = new Color3(0.8, 0.4, 0.1);
        material.emissiveColor = new Color3(0.4, 0.2, 0.05);
        break;
      case 'security':
        mesh = MeshBuilder.CreatePolyhedron(name, { size: 1.5 }, this.scene);
        material.diffuseColor = new Color3(0.8, 0.1, 0.1);
        material.emissiveColor = new Color3(0.4, 0.05, 0.05);
        break;
      case 'blockchain':
        mesh = MeshBuilder.CreateIcoSphere(name, { radius: 1.5 }, this.scene);
        material.diffuseColor = new Color3(0.8, 0.6, 0.1);
        material.emissiveColor = new Color3(0.4, 0.3, 0.05);
        break;
      case 'interface':
        mesh = MeshBuilder.CreateBox(name, { width: 3, height: 0.5, depth: 2 }, this.scene);
        material.diffuseColor = new Color3(0.4, 0.2, 0.8);
        material.emissiveColor = new Color3(0.2, 0.1, 0.4);
        break;
      default:
        mesh = MeshBuilder.CreateBox(name, { size: 2 }, this.scene);
        material.diffuseColor = new Color3(0.5, 0.5, 0.5);
    }
    
    mesh.position = position;
    mesh.material = material;
    
    // 添加浮动动画
    const animationY = new Animation('floatingAnimation', 'position.y', 30, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);
    const keys = [];
    keys.push({ frame: 0, value: position.y });
    keys.push({ frame: 60, value: position.y + 0.3 });
    keys.push({ frame: 120, value: position.y });
    animationY.setKeys(keys);
    mesh.animations.push(animationY);
    this.scene.beginAnimation(mesh, 0, 120, true);
    
    this.components.set(name, { mesh, name, description: `${name}组件` });
    return mesh;
  }

  private createConnectionLines(): void {
    const points = [
      [Vector3.Zero(), new Vector3(0, -4, 0)], // 核心服务器 -> 数据库
      [Vector3.Zero(), new Vector3(0, 4, 0)],  // 核心服务器 -> API网关
      [Vector3.Zero(), new Vector3(-4, 0, 4)], // 核心服务器 -> 安全模块
      [Vector3.Zero(), new Vector3(0, 0, -6)], // 核心服务器 -> 区块链节点
      [new Vector3(0, 4, 0), new Vector3(0, 8, 0)], // API网关 -> 用户界面
    ];

    points.forEach((pointPair, index) => {
      const line = MeshBuilder.CreateLines(`connection${index}`, { points: pointPair }, this.scene);
      const lineMaterial = new StandardMaterial(`lineMaterial${index}`, this.scene);
      lineMaterial.emissiveColor = new Color3(0, 0.8, 1);
      lineMaterial.alpha = 0.8;
      line.material = lineMaterial;
      line.isPickable = false;
    });
  }

  private setupInteractions(): void {
    this.components.forEach((component) => {
      const mesh = component.mesh;
      mesh.actionManager = new ActionManager(this.scene);
      
      mesh.actionManager.registerAction(new ExecuteCodeAction(
        ActionManager.OnPointerOverTrigger,
        () => {
          this.highlightLayer.addMesh(mesh, new Color3(0, 1, 1));
          this.showTooltip(component.name, component.description);
        }
      ));
      
      mesh.actionManager.registerAction(new ExecuteCodeAction(
        ActionManager.OnPointerOutTrigger,
        () => {
          this.highlightLayer.removeMesh(mesh);
          this.hideTooltip();
        }
      ));
      
      mesh.actionManager.registerAction(new ExecuteCodeAction(
        ActionManager.OnPickTrigger,
        () => {
          this.showDetailPanel(component);
        }
      ));
    });
  }

  private showTooltip(name: string, description: string): void {
    console.log(`Tooltip: ${name} - ${description}`);
  }

  private hideTooltip(): void {
    console.log('Hide tooltip');
  }

  private showDetailPanel(component: any): void {
    console.log(`Detail panel for: ${component.name}`);
  }

  private setupControls(): void {
    const resetBtn = document.getElementById('resetCamera');
    const autoRotateBtn = document.getElementById('autoRotate');
    const wireframeBtn = document.getElementById('toggleWireframe');

    resetBtn?.addEventListener('click', () => this.resetCamera());
    autoRotateBtn?.addEventListener('click', () => this.toggleAutoRotation());
    wireframeBtn?.addEventListener('click', () => this.toggleWireframe());
  }

  private resetCamera(): void {
    Animation.CreateAndStartAnimation(
      'cameraReset',
      this.camera,
      'alpha',
      30,
      30,
      this.camera.alpha,
      -Math.PI / 2,
      Animation.ANIMATIONLOOPMODE_CONSTANT
    );
  }

  private toggleAutoRotation(): void {
    this.isAutoRotating = !this.isAutoRotating;
    const btn = document.getElementById('autoRotate');
    if (btn) {
      btn.textContent = this.isAutoRotating ? '停止旋转' : '自动旋转';
    }
  }

  private toggleWireframe(): void {
    this.scene.meshes.forEach(mesh => {
      if (mesh.material && mesh.name !== 'skybox') {
        (mesh.material as StandardMaterial).wireframe = !(mesh.material as StandardMaterial).wireframe;
      }
    });
  }

  private startRenderLoop(): void {
    this.engine.runRenderLoop(() => {
      if (this.isAutoRotating) {
        this.camera.alpha += 0.01;
      }
      this.scene.render();
    });

    window.addEventListener('resize', () => {
      this.engine.resize();
    });
  }

  private hideLoading(): void {
    const loading = document.getElementById('loading');
    if (loading) {
      loading.style.display = 'none';
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
    this.scene.dispose();
    this.engine.dispose();
  }
}