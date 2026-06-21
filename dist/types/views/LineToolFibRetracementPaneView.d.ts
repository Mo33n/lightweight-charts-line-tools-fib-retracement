import { IChartApiBase, ISeriesApi, SeriesType } from 'lightweight-charts';
import { LineToolPaneView, CompositeRenderer, SegmentRenderer, RectangleRenderer, TextRenderer } from 'lightweight-charts-line-tools-core';
import { LineToolFibRetracement } from '../model/LineToolFibRetracement';
/**
 * Pane View for the Fibonacci Retracement tool.
 *
 * **Tutorial Note on Complexity:**
 * This is the most complex view in the library. While most tools have one renderer, the
 * Fib Retracement manages an **array of renderer sets**. For every level (e.g., 0.618),
 * it coordinates:
 * 1. A `SegmentRenderer` for the level line.
 * 2. A `RectangleRenderer` for the fill between this level and the previous one.
 * 3. A `TextRenderer` for the coefficient and price label.
 *
 * It implements a "Sub-Segment" culling strategy to ensure the tool remains visible
 * as long as any individual level line is on screen.
 */
export declare class LineToolFibRetracementPaneView<HorzScaleItem> extends LineToolPaneView<HorzScaleItem> {
    /**
     * An array of pooled renderer sets. Each entry contains the line, rectangle,
     * and label renderers for a specific Fibonacci level.
     * @protected
     */
    protected _levelRenderers: {
        line: SegmentRenderer<HorzScaleItem>;
        rectangle: RectangleRenderer<HorzScaleItem>;
        label: TextRenderer<HorzScaleItem>;
    }[];
    /**
     * Renderer for the primary trend line (P0 to P1) that defines the Fib range.
     * @protected
     */
    protected _primaryLineRenderer: SegmentRenderer<HorzScaleItem>;
    /**
     * Initializes the Fibonacci View and pre-allocates renderer sets for the
     * levels configured in the tool options.
     *
     * @param source - The specific Fibonacci model instance.
     * @param chart - The Chart API.
     * @param series - The Series API.
     */
    constructor(source: LineToolFibRetracement<HorzScaleItem>, chart: IChartApiBase<any>, series: ISeriesApi<SeriesType, any>);
    /**
     * Calculates the price difference between the current level and a user-specified
     * target coefficient.
     *
     * **Tutorial Note:**
     * This feature allows traders to see exactly how many price units exist between
     * two specific Fib levels (e.g., "Distance from 0.618 to 0.5").
     *
     * @param config - The configuration for the current level.
     * @param levelPrice - The calculated price of the current level.
     * @param levelsConfig - The full list of level configurations.
     * @param levelsData - The pre-calculated coordinates and prices for all levels.
     * @returns A formatted string like "(Diff: 10.50 from 0.5 line)" or an empty string.
     * @private
     */
    private _calculateDistanceText;
    /**
     * Helper to generate a translucent RGBA color string from a hex or rgb input.
     *
     * **Why use this?**
     * To create the "faded" background effect between Fib levels, we must apply
     * the user-defined `opacity` to the level's primary `color`. This method parses
     * various CSS color formats and injects the correct alpha value.
     *
     * @param color - The base color string (Hex or RGB).
     * @param opacity - The alpha value (0 to 1).
     * @returns A valid `rgba(...)` CSS string.
     * @private
     */
    private _getFadedColor;
    /**
     * Orchestrates the multi-stage rendering pass for the Fibonacci Retracement.
     *
     * This method performs the following steps:
     * 1. **Culling Check:** Queries the Model to see if the tool is off-screen.
     * 2. **Data Sync:** Retrieves sorted segment data from the Model.
     * 3. **Pixel Mapping:** Converts logical prices to screen Y-coordinates for all levels.
     * 4. **Render Loop:** Iterates through configured levels to set up lines, fills, and labels.
     *
     * @param height - The height of the pane in pixels.
     * @param width - The width of the pane in pixels.
     * @protected
     * @override
     */
    protected _updateImpl(height: number, width: number): void;
    /**
     * Adds the two primary interactive anchor points (P0 and P1).
     *
     * @param renderer - The composite renderer to append anchors to.
     * @protected
     * @override
     */
    protected _addAnchors(renderer: CompositeRenderer<HorzScaleItem>): void;
}
