import { 
  Scene, 
  Mesh, 
  HighlightLayer, 
  ActionManager, 
  ExecuteCodeAction, 
  Vector3, 
  Color3,
  Animation,
  PointerEventTypes,
  PointerInfo,
  AbstractMesh
} from '@babylonjs/core';
import { AdvancedDynamicTexture, TextBlock, Rectangle, Control } from '@babylonjs/gui';
import { WalletArchitecture, WalletComponent } from './WalletArchitecture';

export class InteractionManager {
  private scene: Scene;
  private highlightLayer: HighlightLayer;
  private gui: AdvancedDynamicTexture;
  private infoPanel: Rectangle | null = null;

  private walletArchitecture: WalletArchitecture | null = null;

  constructor(scene: Scene, highlightLayer: HighlightLayer) {
    this.scene = scene;
    this.highlightLayer = highlightLayer;
    this.gui = AdvancedDynamicTexture.CreateFullscreenUI('InteractionUI');
    this.setupPointerObserver();
  }

  public setWalletArchitecture(walletArchitecture: WalletArchitecture): void {
    this.walletArchitecture = walletArchitecture;
  }

  public setupHoverEffects(): void {
    this.scene.meshes.forEach(mesh => {
      if (mesh.name.includes('skybox') || mesh.name.includes('connectionLine')) {
        return;
      }

      mesh.actionManager = new ActionManager(this.scene);
      
      // 鼠标悬停进入
      mesh.actionManager.registerAction(new ExecuteCodeAction(
        ActionManager.OnPointerOverTrigger,
        () => {
          this.onMeshHover(mesh, true);
        }
      ));
      
      // 鼠标悬停离开
      mesh.actionManager.registerAction(new ExecuteCodeAction(
        ActionManager.OnPointerOutTrigger,
        () => {
          this.onMeshHover(mesh, false);
        }
      ));
    });
  }

  public setupClickActions(): void {
    this.scene.meshes.forEach(mesh => {
      if (mesh.name.includes('skybox') || mesh.name.includes('connectionLine')) {
        return;
      }

      if (!mesh.actionManager) {
        mesh.actionManager = new ActionManager(this.scene);
      }
      
      // 点击事件
      mesh.actionManager.registerAction(new ExecuteCodeAction(
        ActionManager.OnPickTrigger,
        () => {
          this.onMeshClick(mesh);
        }
      ));
    });
  }

  private setupPointerObserver(): void {
    this.scene.onPointerObservable.add((pointerInfo: PointerInfo) => {
      if (pointerInfo.type === PointerEventTypes.POINTERMOVE) {
        this.updateCursor(pointerInfo);
      }
    });
  }

  private updateCursor(pointerInfo: PointerInfo): void {
    const canvas = this.scene.getEngine().getRenderingCanvas();
    if (!canvas) return;

    const pickResult = this.scene.pick(
      pointerInfo.event.offsetX,
      pointerInfo.event.offsetY
    );

    if (pickResult.hit && pickResult.pickedMesh) {
      const mesh = pickResult.pickedMesh;
      if (!mesh.name.includes('skybox') && !mesh.name.includes('connectionLine')) {
        canvas.style.cursor = 'pointer';
      } else {
        canvas.style.cursor = 'grab';
      }
    } else {
      canvas.style.cursor = 'grab';
    }
  }

  private onMeshHover(mesh: AbstractMesh, isHovering: boolean): void {
    if (isHovering) {
      this.highlightLayer.addMesh(mesh as Mesh, new Color3(0, 1, 1));
      this.showInfoPanel(mesh);
      this.animateMeshScale(mesh as Mesh, 1.1);
    } else {
      this.highlightLayer.removeMesh(mesh as Mesh);
      this.hideInfoPanel();
      this.animateMeshScale(mesh as Mesh, 1.0);
    }
  }

  private onMeshClick(mesh: AbstractMesh): void {
    if (!this.walletArchitecture) return;

    const component = this.walletArchitecture.getComponentByMesh(mesh as Mesh);
    if (component) {
      this.showDetailedInfo(component);
      this.highlightConnections(component);
      this.animateClickEffect(mesh as Mesh);
    }
  }

  private showInfoPanel(mesh: AbstractMesh): void {
    if (!this.walletArchitecture) return;

    const component = this.walletArchitecture.getComponentByMesh(mesh as Mesh);
    if (!component) return;

    this.infoPanel = new Rectangle('infoPanel');
    this.infoPanel.widthInPixels = 300;
    this.infoPanel.heightInPixels = 120;
    this.infoPanel.cornerRadius = 10;
    this.infoPanel.color = 'white';
    this.infoPanel.thickness = 2;
    this.infoPanel.background = 'rgba(0, 0, 0, 0.8)';
    this.infoPanel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    this.infoPanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    this.infoPanel.topInPixels = 120;
    this.infoPanel.left = '20px';

    const titleText = new TextBlock('titleText', component.name);
    titleText.color = 'white';
    titleText.fontSize = 18;
    titleText.fontWeight = 'bold';
    titleText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    titleText.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    titleText.topInPixels = 10;

    const descText = new TextBlock('descText', component.description);
    descText.color = '#cccccc';
    descText.fontSize = 14;
    descText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    descText.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    descText.textWrapping = true;
    descText.topInPixels = 10;

    const typeText = new TextBlock('typeText', `类型: ${this.getTypeDisplayName(component.type)}`);
    typeText.color = '#88ccff';
    typeText.fontSize = 12;
    typeText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    typeText.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    typeText.topInPixels = -10;

    this.infoPanel.addControl(titleText);
    this.infoPanel.addControl(descText);
    this.infoPanel.addControl(typeText);

    this.gui.addControl(this.infoPanel);

    // 添加淡入动画
    this.infoPanel.alpha = 0;
    Animation.CreateAndStartAnimation(
      'fadeIn',
      this.infoPanel,
      'alpha',
      30,
      15,
      0,
      1,
      Animation.ANIMATIONLOOPMODE_CONSTANT
    );
  }

  private hideInfoPanel(): void {
    if (this.infoPanel) {
      // 添加淡出动画
      Animation.CreateAndStartAnimation(
        'fadeOut',
        this.infoPanel,
        'alpha',
        30,
        15,
        1,
        0,
        Animation.ANIMATIONLOOPMODE_CONSTANT,
        undefined,
        () => {
          if (this.infoPanel) {
            this.gui.removeControl(this.infoPanel);
            this.infoPanel = null;
          }
        }
      );
    }
  }

  private showDetailedInfo(component: WalletComponent): void {
    // 移除现有的详细信息面板
    this.hideDetailedInfo();

    const detailPanel = new Rectangle('detailPanel');
    detailPanel.widthInPixels = 400;
    detailPanel.heightInPixels = 250;
    detailPanel.cornerRadius = 15;
    detailPanel.color = 'white';
    detailPanel.thickness = 2;
    detailPanel.background = 'rgba(0, 20, 40, 0.95)';
    detailPanel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    detailPanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    detailPanel.topInPixels = 120;
    detailPanel.leftInPixels = 20;

    const titleText = new TextBlock('detailTitle', component.name);
    titleText.color = '#00d4ff';
    titleText.fontSize = 20;
    titleText.fontWeight = 'bold';
    titleText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    titleText.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    titleText.topInPixels = 15;

    const descText = new TextBlock('detailDesc', component.description);
    descText.color = 'white';
    descText.fontSize = 14;
    descText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    descText.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    descText.textWrapping = true;
    descText.topInPixels = -20;

    const typeText = new TextBlock('detailType', `类型: ${this.getTypeDisplayName(component.type)}`);
    typeText.color = '#88ccff';
    typeText.fontSize = 12;
    typeText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    typeText.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    typeText.topInPixels = -60;

    const connectionsText = new TextBlock('detailConnections', 
      `连接: ${component.connections.length} 个组件`);
    connectionsText.color = '#ffcc88';
    connectionsText.fontSize = 12;
    connectionsText.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    connectionsText.textVerticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    connectionsText.topInPixels = -40;

    const closeButton = new Rectangle('closeButton');
    closeButton.widthInPixels = 60;
    closeButton.heightInPixels = 25;
    closeButton.cornerRadius = 5;
    closeButton.color = 'white';
    closeButton.thickness = 1;
    closeButton.background = 'rgba(255, 100, 100, 0.8)';
    closeButton.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    closeButton.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    closeButton.topInPixels = 10;
    closeButton.left = '-10px';

    const closeText = new TextBlock('closeText', '关闭');
    closeText.color = 'white';
    closeText.fontSize = 12;
    closeButton.addControl(closeText);

    closeButton.onPointerClickObservable.add(() => {
      this.hideDetailedInfo();
    });

    detailPanel.addControl(titleText);
    detailPanel.addControl(descText);
    detailPanel.addControl(typeText);
    detailPanel.addControl(connectionsText);
    detailPanel.addControl(closeButton);

    this.gui.addControl(detailPanel);

    // 添加滑入动画
    detailPanel.leftInPixels = -400;
    Animation.CreateAndStartAnimation(
      'slideIn',
      detailPanel,
      'leftInPixels',
      30,
      30,
      -400,
      20,
      Animation.ANIMATIONLOOPMODE_CONSTANT
    );
  }

  private hideDetailedInfo(): void {
    const detailPanel = this.gui.getControlByName('detailPanel');
    if (detailPanel) {
      this.gui.removeControl(detailPanel);
    }
  }

  private highlightConnections(component: WalletComponent): void {
    if (!this.walletArchitecture) return;

    const components = this.walletArchitecture.getComponents();
    
    // 清除之前的高亮
    components.forEach((comp) => {
      this.highlightLayer.removeMesh(comp.mesh);
    });

    // 高亮主组件
    this.highlightLayer.addMesh(component.mesh, new Color3(1, 0, 0));

    // 高亮连接的组件
    component.connections.forEach(connectionId => {
      const connectedComponent = components.get(connectionId);
      if (connectedComponent) {
        this.highlightLayer.addMesh(connectedComponent.mesh, new Color3(0, 1, 0));
      }
    });

    // 3秒后清除高亮
    setTimeout(() => {
      components.forEach((comp) => {
        this.highlightLayer.removeMesh(comp.mesh);
      });
    }, 3000);
  }

  private animateMeshScale(mesh: Mesh, targetScale: number): void {
    Animation.CreateAndStartAnimation(
      'scaleAnimation',
      mesh,
      'scaling',
      30,
      15,
      mesh.scaling.clone(),
      new Vector3(targetScale, targetScale, targetScale),
      Animation.ANIMATIONLOOPMODE_CONSTANT
    );
  }

  private animateClickEffect(mesh: Mesh): void {
    const originalPosition = mesh.position.clone();
    
    // 脉冲效果
    Animation.CreateAndStartAnimation(
      'pulseEffect',
      mesh,
      'scaling',
      60,
      30,
      mesh.scaling.clone(),
      mesh.scaling.scale(1.3),
      Animation.ANIMATIONLOOPMODE_YOYO
    );

    // 轻微震动效果
    const shakeAnimation = new Animation(
      'shake',
      'position',
      60,
      Animation.ANIMATIONTYPE_VECTOR3,
      Animation.ANIMATIONLOOPMODE_CONSTANT
    );

    const keys = [];
    for (let i = 0; i <= 10; i++) {
      const randomOffset = new Vector3(
        (Math.random() - 0.5) * 0.1,
        (Math.random() - 0.5) * 0.1,
        (Math.random() - 0.5) * 0.1
      );
      keys.push({
        frame: i * 3,
        value: originalPosition.add(randomOffset)
      });
    }
    keys.push({
      frame: 30,
      value: originalPosition
    });

    shakeAnimation.setKeys(keys);
    mesh.animations.push(shakeAnimation);
    
    this.scene.beginAnimation(mesh, 0, 30, false, 1, () => {
      mesh.position = originalPosition;
    });
  }

  private getTypeDisplayName(type: WalletComponent['type']): string {
    const typeMap = {
      'server': '服务器',
      'database': '数据库',
      'api': 'API服务',
      'security': '安全模块',
      'interface': '用户界面',
      'blockchain': '区块链'
    };
    return typeMap[type] || type;
  }
}