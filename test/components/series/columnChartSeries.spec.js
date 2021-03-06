/**
 * @fileoverview test column chart series
 * @author NHN Ent.
 *         FE Development Lab <dl_javascript@nhnent.com>
 */

'use strict';

var columnSeriesFactory = require('../../../src/js/components/series/columnChartSeries.js');
var SeriesDataModel = require('../../../src/js/models/data/seriesDataModel');
var seriesGroup = require('../../../src/js/models/data/seriesGroup');
var renderUtil = require('../../../src/js/helpers/renderUtil.js');

describe('ColumnChartSeries', function() {
    var series, dataProcessor;

    beforeAll(function() {
        // 브라우저마다 렌더된 너비, 높이 계산이 다르기 때문에 일관된 결과가 나오도록 처리함
        spyOn(renderUtil, 'getRenderedLabelWidth').and.returnValue(40);
        spyOn(renderUtil, 'getRenderedLabelHeight').and.returnValue(20);
    });

    beforeEach(function() {
        dataProcessor = jasmine.createSpyObj('dataProcessor', ['getSeriesDataModel', 'getFirstItemLabel', 'getFormatFunctions']);
        dataProcessor.getFirstItemLabel.and.returnValue('1');
        dataProcessor.getFormatFunctions.and.returnValue([]);

        series = new columnSeriesFactory.ColumnChartSeries({
            chartType: 'column',
            theme: {
                label: {
                    fontFamily: 'Verdana',
                    fontSize: 11,
                    fontWeight: 'normal'
                }
            },
            options: {},
            dataProcessor: dataProcessor,
            eventBus: new tui.util.CustomEvents()
        });
    });

    describe('_makeBound()', function() {
        it('baseBound 정보에 startLeft, endLeft, endWidth정보를 더하여 start, end로 구분된 bound 정보를 생성합니다.', function() {
            var width = 40,
                height = 30,
                left = 10,
                startTop = 10,
                endTop = 20,
                actual = series._makeBound(width, height, left, startTop, endTop),
                expected = {
                    start: {
                        left: 10,
                        top: 10,
                        width: 40,
                        height: 0
                    },
                    end: {
                        left: 10,
                        top: 20,
                        width: 40,
                        height: 30
                    }
                };
            expect(actual).toEqual(expected);
        });
    });

    describe('_makeColumnChartBound()', function() {
        it('옵션 없는 바 차트의 bound 정보를 생성합니다.', function() {
            var baseData = {
                    baseBarSize: 100,
                    basePosition: 40,
                    barSize: 20,
                    pointInterval: 20
                },
                iterationData = {
                    baseLeft: 10,
                    left: 0,
                    plusTop: 0
                },
                isStacked = false,
                seriesItem = {
                    value: 10,
                    startRatio: 0,
                    ratioDistance: 0.4
                },
                index = 0,
                actual = series._makeColumnChartBound(baseData, iterationData, isStacked, seriesItem, index),
                expected = {
                    start: {
                        top: 50,
                        left: 20,
                        width: 20,
                        height: 0
                    },
                    end: {
                        top: 10,
                        left: 20,
                        width: 20,
                        height: 40
                    }
                };

            expect(actual).toEqual(expected);
        });
    });

    describe('_makeBounds()', function() {
        it('옵션 없는 바 차트의 bounds 정보를 생성합니다.', function() {
            var actual, expected;
            var seriesDataModel = new SeriesDataModel();

            dataProcessor.getSeriesDataModel.and.returnValue(seriesDataModel);
            seriesDataModel.groups = [
                new seriesGroup([{
                    value: 40,
                    startRatio: 0,
                    ratioDistance: 0.4
                }, {
                    value: 60,
                    startRatio: 0,
                    ratioDistance: 0.6
                }])
            ];
            series.layout = {
                dimension: {
                    width: 100,
                    height: 100
                },
                position: {
                    left: 0,
                    top: 0
                }
            };
            spyOn(series, '_makeBaseDataForMakingBound').and.returnValue({
                groupSize: 25,
                firstAdditionalPosition: 0,
                baseBarSize: 100,
                basePosition: 60,
                barSize: 20,
                pointInterval: 20
            });

            actual = series._makeBounds();
            expected = [[
                {
                    start: {
                        top: 70,
                        left: 10,
                        width: 20,
                        height: 0
                    },
                    end: {
                        top: 30,
                        left: 10,
                        width: 20,
                        height: 40
                    }
                }, {
                    start: {
                        top: 70,
                        left: 30,
                        width: 20,
                        height: 0
                    },
                    end: {
                        top: 10,
                        left: 30,
                        width: 20,
                        height: 60
                    }
                }
            ]];

            expect(actual).toEqual(expected);
        });
    });

    describe('_calculateLeftPositionOfSumLabel()', function() {
        it('calculate left position of sum label', function() {
            var actual = series._calculateLeftPositionOfSumLabel({
                left: 10,
                width: 30
            }, 20);
            var expected = 6;
            expect(actual).toBe(expected);
        });
    });
});
