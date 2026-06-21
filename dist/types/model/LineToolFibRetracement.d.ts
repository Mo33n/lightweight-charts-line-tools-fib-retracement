import { IChartApiBase, ISeriesApi, IHorzScaleBehavior, SeriesType, Coordinate } from 'lightweight-charts';
import { BaseLineTool, LineToolPoint, LineToolOptionsInternal, LineToolType, DeepPartial, LineToolsCorePlugin, PriceAxisLabelStackingManager, HitTestResult, Point, InteractionPhase, ConstraintResult } from 'lightweight-charts-line-tools-core';
/**
 * Defines the default configuration for the Fibonacci Retracement tool.
 *
 * **Tutorial Note:**
 * This tool is structurally complex because it generates many visual elements from just two points.
 * These defaults include:
 * 1. **Levels:** An array of coefficients (0, 0.236, 0.382, etc.) with their associated colors and opacities.
 * 2. **Extension:** Configuration to extend all level lines infinitely to the left or right.
 * 3. **Trade Strategy:** A placeholder structure for advanced trading setups (Entry/Stop/Target) linked to Fib levels.
 *
 * Reusing these defaults ensures that any new Fib tool starts with the standard industry levels.
 */
export declare const FibRetracementOptionDefaults: LineToolOptionsInternal<'FibRetracement'>;
/**
 * Concrete implementation of the Fibonacci Retracement drawing tool.
 *
 * **What is a Fibonacci Retracement?**
 * It is a tool used to identify potential support and resistance levels. It is defined by
 * a "Trend Line" connecting two extreme points (usually a high and a low).
 *
 * **Logic Overview:**
 * The tool calculates the vertical distance between P0 and P1 and then draws horizontal
 * lines at specific percentages (coefficients) of that distance.
 *
 * **Inheritance:**
 * It extends `BaseLineTool` directly. While it shares the 2-point requirement of a Trend Line,
 * its rendering and culling logic are entirely unique, necessitating a distinct model and view.
 */
export declare class LineToolFibRetracement<HorzScaleItem> extends BaseLineTool<HorzScaleItem> {
    /**
     * The unique identifier for this tool type ('FibRetracement').
     *
     * @override
     */
    readonly toolType: LineToolType;
    /**
     * Defines the number of anchor points required to draw this tool.
     *
     * A Fib Retracement requires exactly **2 points** to define the range.
     *
     * @override
     */
    readonly pointsCount: number;
    /**
     * Explicitly defines the highest valid index for an interactive anchor point.
     *
     * Since the tool is defined by 2 points, the valid handles are at index 0 and 1.
     *
     * @override
     * @returns `1`
     */
    maxAnchorIndex(): number;
    /**
     * Confirms that this tool can be created via discrete mouse clicks.
     *
     * @override
     * @returns `true`
     */
    supportsClickClickCreation(): boolean;
    /**
     * Confirms that this tool can be created via a click-and-drag gesture.
     *
     * @override
     * @returns `true`
     */
    supportsClickDragCreation(): boolean;
    /**
     * Enables geometric constraints (Shift key) during click-based creation.
     *
     * @override
     * @returns `true`
     */
    supportsShiftClickClickConstraint(): boolean;
    /**
     * Enables geometric constraints (Shift key) during drag-based creation or editing.
     *
     * @override
     * @returns `true`
     */
    supportsShiftClickDragConstraint(): boolean;
    /**
     * Initializes the Fibonacci Retracement tool.
     *
     * **Tutorial Note on Construction:**
     * 1. **Deep Copy:** It performs a `deepCopy` of the `FibRetracementOptionDefaults` to ensure
     *    this tool instance has its own unique levels array that won't affect other instances.
     * 2. **Merge:** It merges the user's `options` to allow custom level colors or visibility.
     * 3. **View:** It assigns the `LineToolFibRetracementPaneView`, which handles the heavy lifting
     *    of iterating through levels and drawing lines and fills.
     *
     * @param coreApi - The Core Plugin API.
     * @param chart - The Lightweight Charts Chart API.
     * @param series - The Series API this tool is attached to.
     * @param horzScaleBehavior - The horizontal scale behavior.
     * @param options - Configuration overrides.
     * @param points - Initial points.
     * @param priceAxisLabelStackingManager - The manager for label collision.
     */
    constructor(coreApi: LineToolsCorePlugin<HorzScaleItem>, chart: IChartApiBase<HorzScaleItem>, series: ISeriesApi<SeriesType, HorzScaleItem>, horzScaleBehavior: IHorzScaleBehavior<HorzScaleItem>, options: DeepPartial<LineToolOptionsInternal<'FibRetracement'>>, points: LineToolPoint[] | undefined, priceAxisLabelStackingManager: PriceAxisLabelStackingManager<HorzScaleItem>);
    /**
     * Calculates the exact logical coordinates (Time and Price) for every configured Fibonacci level.
     *
     * **Tutorial Note on the Math:**
     * 1. It calculates the vertical range (Price Difference) between the two defining points (P0 and P1).
     * 2. For each coefficient (e.g., 0.618), it calculates the resulting price: `Price = P1 - (Range * Coefficient)`.
     * 3. It generates two logical points per level, spanning horizontally between the min/max time of the anchors.
     *
     * This method serves as the "Calculated Data Source" for both the rendering logic and the culling engine.
     *
     * @returns An array of level data, including the start/end logical points, the raw price, and the coefficient.
     */
    getLineSegmentPoints(): {
        start: LineToolPoint;
        end: LineToolPoint;
        price: number;
        coeff: number;
    }[];
    /**
     * Flattens all calculated Fibonacci levels into a single array of logical points for the culling engine.
     *
     * **Why is this needed?**
     * The culling engine requires a flat list of points to perform its geometric intersection tests.
     * Since a Fib Retracement isn't just one line but a collection of many, this helper ensures
     * every level is accounted for when determining if the tool should be rendered.
     *
     * @returns A flat array of `LineToolPoint` objects representing every level.
     */
    getAllLogicalPointsForCulling(): LineToolPoint[];
    /**
     * Intentionally empty override to prevent automatic point sorting.
     *
     * **Tutorial Note:**
     * In many tools, sorting points by time (Left-to-Right) is helpful. However, in a Fibonacci
     * Retracement, the **direction** of the draw (High-to-Low vs. Low-to-High) defines whether
     * the tool measures a "Retracement" or an "Extension".
     *
     * By disabling normalization, we preserve the user's intended directionality.
     *
     * @override
     */
    normalize(): void;
    /**
     * Implements a horizontal lock (Price Lock) constraint when the Shift key is held during editing.
     *
     * **Logic Details:**
     * When dragging an anchor point while holding Shift, the tool locks the movement to the
     * anchor's **original Price level**. This allows the user to slide the Fibonacci tool
     * left or right across the timeline to align with different bars without accidentally
     * shifting the vertical price range.
     *
     * @param pointIndex - The index of the anchor being dragged.
     * @param rawScreenPoint - The current mouse position.
     * @param phase - The interaction phase (Creation or Editing).
     * @param originalLogicalPoint - The snapshot of the point's logical state before the drag began.
     * @param allOriginalLogicalPoints - The full state of all points before the drag began.
     * @returns The constrained result locking the Y-axis to the original price.
     * @override
     */
    getShiftConstrainedPoint(pointIndex: number, rawScreenPoint: Point, phase: InteractionPhase, originalLogicalPoint: LineToolPoint, allOriginalLogicalPoints: LineToolPoint[]): ConstraintResult;
    /**
     * Performs a hit test for the Fibonacci tool by delegating to its associated Pane View.
     *
     * **Architecture Note:**
     * Because this tool renders many independent segments (lines) and areas (fills),
     * the logic for "What did the user click?" is most accurately handled by the View's
     * `CompositeRenderer`.
     *
     * Calling `renderer()` on the view ensures the visual state is up-to-date before the
     * hit-test is performed.
     *
     * @param x - X coordinate in pixels.
     * @param y - Y coordinate in pixels.
     * @returns A hit result if the mouse is over any line, fill, or handle, otherwise `null`.
     * @override
     */
    _internalHitTest(x: Coordinate, y: Coordinate): HitTestResult<any> | null;
    /**
     * Calculates the Fibonacci tool's visibility using an Area-Based Zone strategy.
     *
     * ### Tutorial Note on Fibonacci Area Culling
     * Fibonacci tools represent a "Zone of Interest" on the chart. To prevent
     * background fills from "popping" out when the user zooms in between levels,
     * we treat the entire tool as a solid 2D area.
     *
     * 1. We identify the Price extremes (the highest and lowest level prices).
     * 2. We identify the Time extremes (earliest and latest anchor point).
     * 3. We pass this bounding area to the core with the 'isAreaBased' flag.
     *
     * This instructs the culling engine to perform a 2D intersection check.
     * It also automatically handles infinite extensions by expanding this
     * zone to the horizon, ensuring visibility even when the anchors
     * are far off-screen.
     *
     * @protected
     * @override
     */
    protected updateCullingState(): void;
}
