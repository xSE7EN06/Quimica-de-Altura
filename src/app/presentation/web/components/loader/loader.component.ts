import {
    Component,
    ElementRef,
    OnDestroy,
    ViewChild,
    inject,
    effect,
    input,
    computed,
} from '@angular/core';
import { LoadingService } from '../../../../application/services/loading.service';

@Component({
    selector: 'app-loader',
    standalone: true,
    templateUrl: './loader.component.html',
    styleUrl: './loader.component.scss',
})
export class LoaderComponent implements OnDestroy {
    loadingService = inject(LoadingService);

    /** 'fullscreen' = full-page overlay (login/dashboard), 'inline' = embedded in a container */
    mode = input<'fullscreen' | 'inline'>('fullscreen');

    /** For inline mode: control visibility directly via signal input instead of LoadingService */
    loading = input<boolean | null>(null);

    @ViewChild('sun', { static: true }) sun!: ElementRef<SVGGElement>;
    @ViewChild('rays', { static: true }) rays!: ElementRef<SVGGElement>;
    @ViewChild('stem', { static: true }) stem!: ElementRef<SVGPathElement>;
    @ViewChild('leafL', { static: true }) leafL!: ElementRef<SVGGElement>;
    @ViewChild('leafR', { static: true }) leafR!: ElementRef<SVGGElement>;
    @ViewChild('flower', { static: true }) flower!: ElementRef<SVGGElement>;

    private animationFrameId?: number;
    private BASE_X = 200;
    private BASE_Y = 360;
    private ARC_CX = 200;
    private ARC_CY = 260;
    private ARC_R = 110;
    private DUR = 5000;

    private prevFlowerT = 0.5;
    private flowerVel = 0;

    /** Resolved visibility: uses loading input if provided, otherwise LoadingService */
    isActive = computed(() => {
        const loadingInput = this.loading();
        if (loadingInput !== null) {
            return loadingInput;
        }
        return this.loadingService.isLoading();
    });

    constructor() {
        effect(() => {
            if (this.isActive()) {
                if (!this.animationFrameId) {
                    this.animationFrameId = requestAnimationFrame((ts) => this.tick(ts));
                }
            } else {
                if (this.animationFrameId) {
                    cancelAnimationFrame(this.animationFrameId);
                    this.animationFrameId = undefined;
                }
            }
        });
    }

    ngOnDestroy(): void {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
    }

    private tick(ts: number): void {
        if (!this.isActive()) return;

        const raw = (ts % this.DUR) / this.DUR;
        const t = 0.5 - 0.5 * Math.cos(raw * 2 * Math.PI);

        const sunAngle = Math.PI * (1 - t);
        const sunX = this.ARC_CX + this.ARC_R * Math.cos(sunAngle);
        const sunY = this.ARC_CY - this.ARC_R * Math.sin(sunAngle);
        this.sun.nativeElement.setAttribute('transform', `translate(${sunX},${sunY})`);

        const rayRot = (ts * 0.04) % 360;
        const rayPulse = 0.35 + 0.15 * Math.sin(ts * 0.003);
        this.rays.nativeElement.setAttribute('transform', `rotate(${rayRot})`);
        this.rays.nativeElement.setAttribute('opacity', rayPulse.toFixed(2));

        const targetT = t;
        const springK = 0.04;
        const damping = 0.82;
        this.flowerVel = (this.flowerVel + (targetT - this.prevFlowerT) * springK) * damping;
        this.prevFlowerT = this.prevFlowerT + this.flowerVel;
        const ft = Math.max(0, Math.min(1, this.prevFlowerT));

        const sway = (ft - 0.5) * 80;
        const heightCos = Math.cos((ft - 0.5) * Math.PI);
        const stemTopX = this.BASE_X + sway;
        const stemTopY = 280 - heightCos * 35;

        const c1x = this.BASE_X - sway * 0.4;
        const c1y = this.BASE_Y - 30;
        const c2x = this.BASE_X + sway * 1.1;
        const c2y = stemTopY + 25;
        this.stem.nativeElement.setAttribute(
            'd',
            `M${this.BASE_X},${this.BASE_Y} C${c1x},${c1y} ${c2x},${c2y} ${stemTopX},${stemTopY}`
        );

        const tiltDeg = (ft - 0.5) * 45;
        const bob = Math.sin(ts * 0.004) * 2.5 + Math.sin(ts * 0.0067) * 1.5;
        const headScale = 1 + Math.sin(ts * 0.0025) * 0.03;
        this.flower.nativeElement.setAttribute(
            'transform',
            `translate(${stemTopX},${stemTopY + bob}) rotate(${tiltDeg}) scale(${headScale.toFixed(3)})`
        );

        const flutterL = Math.sin(ts * 0.004) * 15 + Math.sin(ts * 0.0095) * 8;
        const flutterR = Math.sin(ts * 0.005 + 2) * 15 + Math.sin(ts * 0.011 + 1) * 8;

        const lp = 0.3;
        const lx = this.cubicB(lp, this.BASE_X, c1x, c2x, stemTopX);
        const ly = this.cubicB(lp, this.BASE_Y, c1y, c2y, stemTopY);
        this.leafL.nativeElement.setAttribute(
            'transform',
            `translate(${lx},${ly}) rotate(${flutterL - 10})`
        );

        const rp = 0.55;
        const rx = this.cubicB(rp, this.BASE_X, c1x, c2x, stemTopX);
        const ry = this.cubicB(rp, this.BASE_Y, c1y, c2y, stemTopY);
        this.leafR.nativeElement.setAttribute(
            'transform',
            `translate(${rx},${ry}) rotate(${flutterR + 10})`
        );

        this.animationFrameId = requestAnimationFrame((newTs) => this.tick(newTs));
    }

    private cubicB(p: number, p0: number, p1: number, p2: number, p3: number): number {
        const ip = 1 - p;
        return ip * ip * ip * p0 + 3 * ip * ip * p * p1 + 3 * ip * p * p * p2 + p * p * p * p3;
    }
}
