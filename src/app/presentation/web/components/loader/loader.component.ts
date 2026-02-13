import {
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild,
    inject,
    effect,
} from '@angular/core';
import { LoadingService } from '../../../../application/services/loading.service';

@Component({
    selector: 'app-loader',
    standalone: true,
    templateUrl: './loader.component.html',
    styleUrl: './loader.component.scss',
})
export class LoaderComponent implements OnInit, OnDestroy {
    loadingService = inject(LoadingService);

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

    constructor() {
        // Only run animation when loading is active
        effect(() => {
            if (this.loadingService.isLoading()) {
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

    ngOnInit(): void { }

    ngOnDestroy(): void {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
    }

    private tick(ts: number): void {
        if (!this.loadingService.isLoading()) return;

        // --- Sun: smooth cosine ping-pong (eases at edges) ---
        const raw = (ts % this.DUR) / this.DUR;
        const t = 0.5 - 0.5 * Math.cos(raw * 2 * Math.PI); // smooth 0→1→0 with ease

        // Sun position along arc
        const sunAngle = Math.PI * (1 - t);
        const sunX = this.ARC_CX + this.ARC_R * Math.cos(sunAngle);
        const sunY = this.ARC_CY - this.ARC_R * Math.sin(sunAngle);
        this.sun.nativeElement.setAttribute('transform', `translate(${sunX},${sunY})`);

        // Rays: slow rotation + subtle pulse
        const rayRot = (ts * 0.04) % 360;
        const rayPulse = 0.35 + 0.15 * Math.sin(ts * 0.003);
        this.rays.nativeElement.setAttribute('transform', `rotate(${rayRot})`);
        this.rays.nativeElement.setAttribute('opacity', rayPulse.toFixed(2));

        // --- Flower: lags behind sun with spring-like inertia ---
        const targetT = t;
        const springK = 0.04; // spring stiffness (lower = more lag)
        const damping = 0.82; // damping (lower = less overshoot)
        this.flowerVel = (this.flowerVel + (targetT - this.prevFlowerT) * springK) * damping;
        this.prevFlowerT = this.prevFlowerT + this.flowerVel;
        const ft = Math.max(0, Math.min(1, this.prevFlowerT)); // clamp

        // Stem top position — tallest at center, shorter at sides (smooth cosine)
        const sway = (ft - 0.5) * 80;
        const heightCos = Math.cos((ft - 0.5) * Math.PI); // 1 at center, 0 at edges
        const stemTopX = this.BASE_X + sway;
        const stemTopY = 280 - heightCos * 35; // 280 at sides, 245 at center

        // Stem: S-curve with cubic bezier — more organic
        const c1x = this.BASE_X - sway * 0.4;
        const c1y = this.BASE_Y - 30;
        const c2x = this.BASE_X + sway * 1.1;
        const c2y = stemTopY + 25;
        this.stem.nativeElement.setAttribute(
            'd',
            `M${this.BASE_X},${this.BASE_Y} C${c1x},${c1y} ${c2x},${c2y} ${stemTopX},${stemTopY}`
        );

        // Flower head: tilt toward sun + micro-bobbing
        const tiltDeg = (ft - 0.5) * 45;
        const bob = Math.sin(ts * 0.004) * 2.5 + Math.sin(ts * 0.0067) * 1.5;
        const headScale = 1 + Math.sin(ts * 0.0025) * 0.03; // subtle petal breathing
        this.flower.nativeElement.setAttribute(
            'transform',
            `translate(${stemTopX},${stemTopY + bob}) rotate(${tiltDeg}) scale(${headScale.toFixed(3)})`
        );

        // --- Leaves: positioned on cubic bezier + organic flutter ---
        const flutterL = Math.sin(ts * 0.004) * 15 + Math.sin(ts * 0.0095) * 8;
        const flutterR = Math.sin(ts * 0.005 + 2) * 15 + Math.sin(ts * 0.011 + 1) * 8;

        // Left leaf at 30% along stem curve
        const lp = 0.3;
        const lx = this.cubicB(lp, this.BASE_X, c1x, c2x, stemTopX);
        const ly = this.cubicB(lp, this.BASE_Y, c1y, c2y, stemTopY);
        this.leafL.nativeElement.setAttribute(
            'transform',
            `translate(${lx},${ly}) rotate(${flutterL - 10})`
        );

        // Right leaf at 55% along stem curve
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
