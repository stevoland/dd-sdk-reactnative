/*
 * Unless explicitly stated otherwise all files in this repository are licensed under the Apache License Version 2.0.
 * This product includes software developed at Datadog (https://www.datadoghq.com/).
 * Copyright 2016-Present Datadog, Inc.
 */

import { NativeModules } from 'react-native';
import { DdSdkConfiguration, DdLogsType, DdTraceType, DdRumType } from './types';
import {InternalLog} from "./InternalLog"
import {SdkVerbosity} from "./SdkVerbosity";
import {TimeProvider} from "./TimeProvider";
import type { DdNativeLogsType, DdNativeRumType, DdNativeSdkType, DdNativeTraceType } from './nativeModulesTypes';

const timeProvider = new TimeProvider();

class DdLogsWrapper implements DdLogsType {

    private nativeLogs: DdNativeLogsType = NativeModules.DdLogs;

    debug(message: string, context: object = {}): Promise<void> {
        InternalLog.log("Tracking debug log “" +  message + "”", SdkVerbosity.DEBUG);
        return this.nativeLogs.debug(message, context);
    }

    info(message: string, context: object = {}): Promise<void> {
        InternalLog.log("Tracking info log “" +  message + "”", SdkVerbosity.DEBUG);
        return this.nativeLogs.info(message, context);
    }

    warn(message: string, context: object = {}): Promise<void> {
        InternalLog.log("Tracking warn log “" +  message + "”", SdkVerbosity.DEBUG);
        return this.nativeLogs.warn(message, context);
    }

    error(message: string, context: object = {}): Promise<void> {
        InternalLog.log("Tracking error log “" +  message + "”", SdkVerbosity.DEBUG);
        return this.nativeLogs.error(message, context);
    }

}

class DdTraceWrapper implements DdTraceType {

    private nativeTrace: DdNativeTraceType = NativeModules.DdTrace;

    startSpan(operation: string, context: object = {}, timestampMs: number = timeProvider.now()): Promise<string> {
        let spanId = this.nativeTrace.startSpan(operation, context, timestampMs);
        InternalLog.log("Starting span “" +  operation + "” #" + spanId, SdkVerbosity.DEBUG);
        return spanId
    }

    finishSpan(spanId: string, context: object = {}, timestampMs: number = timeProvider.now()): Promise<void> {
        InternalLog.log("Finishing span #" +  spanId, SdkVerbosity.DEBUG);
        return this.nativeTrace.finishSpan(spanId, context, timestampMs);
    }
}

class DdRumWrapper implements DdRumType {

    private nativeRum: DdNativeRumType = NativeModules.DdRum;

    startView(key: string, name: string, context: object = {}, timestampMs: number = timeProvider.now()): Promise<void> {
        InternalLog.log("Starting RUM View “" +  name + "” #" + key, SdkVerbosity.DEBUG);
        return this.nativeRum.startView(key, name, context, timestampMs);
    }

    stopView(key: string, context: object = {}, timestampMs: number = timeProvider.now()): Promise<void> {
        InternalLog.log("Stopping RUM View #" + key, SdkVerbosity.DEBUG);
        return this.nativeRum.stopView(key, context, timestampMs);
    }

    startAction(type: string, name: string, context: object = {}, timestampMs: number = timeProvider.now()): Promise<void> {
        InternalLog.log("Starting RUM Action “" + name + "” (" + type + ")", SdkVerbosity.DEBUG);
        return this.nativeRum.startAction(type, name, context, timestampMs);
    }

    stopAction(context: object = {}, timestampMs: number = timeProvider.now()): Promise<void> {
        InternalLog.log("Stopping current RUM Action", SdkVerbosity.DEBUG);
        return this.nativeRum.stopAction(context, timestampMs);
    }

    addAction(type: string, name: string, context: object = {}, timestampMs: number = timeProvider.now()): Promise<void> {
        InternalLog.log("Adding RUM Action “" + name + "” (" + type + ")", SdkVerbosity.DEBUG);
        return this.nativeRum.addAction(type, name, context, timestampMs);
    }

    startResource(key: string, method: string, url: string, context: object = {}, timestampMs: number = timeProvider.now()): Promise<void> {
        InternalLog.log("Starting RUM Resource #" + key + " " + method + ": " + url, SdkVerbosity.DEBUG);
        return this.nativeRum.startResource(key, method, url, context, timestampMs);
    }

    stopResource(key: string, statusCode: number, kind: string, size: number = -1, context: object = {}, timestampMs: number = timeProvider.now()): Promise<void> {
        InternalLog.log("Stopping RUM Resource #" + key + " status:" + statusCode, SdkVerbosity.DEBUG);
        return this.nativeRum.stopResource(key, statusCode, kind, size, context, timestampMs);
    }

    addError(message: string, source: string, stacktrace: string, context: object = {}, timestampMs: number = timeProvider.now()): Promise<void> {
        InternalLog.log("Adding RUM Error “" + message + "”", SdkVerbosity.DEBUG);
        let updatedContext: any = context;
        updatedContext["_dd.error.source_type"] = "react-native";
        return this.nativeRum.addError(message, source, stacktrace, updatedContext, timestampMs);
    }

    addTiming(name: string): Promise<void> {
        InternalLog.log("Adding timing “" + name + "” to RUM View", SdkVerbosity.DEBUG);
        return this.nativeRum.addTiming(name);
    }
}

const DdSdk: DdNativeSdkType = NativeModules.DdSdk;
const DdLogs: DdLogsType = new DdLogsWrapper();
const DdTrace: DdTraceType = new DdTraceWrapper();
const DdRum: DdRumType = new DdRumWrapper();

export { DdSdkConfiguration, DdSdk, DdLogs, DdTrace, DdRum };
