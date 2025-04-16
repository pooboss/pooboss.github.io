
        
                const i32 = (v) => v
                const f32 = i32
                const f64 = i32
                
function toInt(v) {
                    return v
                }
function toFloat(v) {
                    return v
                }
function createFloatArray(length) {
                    return new Float64Array(length)
                }
function setFloatDataView(dataView, position, value) {
                    dataView.setFloat64(position, value)
                }
function getFloatDataView(dataView, position) {
                    return dataView.getFloat64(position)
                }
let IT_FRAME = 0
let FRAME = 0
let BLOCK_SIZE = 0
let SAMPLE_RATE = 0
let NULL_SIGNAL = 0
let INPUT = createFloatArray(0)
let OUTPUT = createFloatArray(0)
const G_sked_ID_NULL = -1
const G_sked__ID_COUNTER_INIT = 1
const G_sked__MODE_WAIT = 0
const G_sked__MODE_SUBSCRIBE = 1


function G_sked_create(isLoggingEvents) {
                return {
                    eventLog: new Set(),
                    events: new Map(),
                    requests: new Map(),
                    idCounter: G_sked__ID_COUNTER_INIT,
                    isLoggingEvents,
                }
            }
function G_sked_wait(skeduler, event, callback) {
                if (skeduler.isLoggingEvents === false) {
                    throw new Error("Please activate skeduler's isLoggingEvents")
                }

                if (skeduler.eventLog.has(event)) {
                    callback(event)
                    return G_sked_ID_NULL
                } else {
                    return G_sked__createRequest(skeduler, event, callback, G_sked__MODE_WAIT)
                }
            }
function G_sked_waitFuture(skeduler, event, callback) {
                return G_sked__createRequest(skeduler, event, callback, G_sked__MODE_WAIT)
            }
function G_sked_subscribe(skeduler, event, callback) {
                return G_sked__createRequest(skeduler, event, callback, G_sked__MODE_SUBSCRIBE)
            }
function G_sked_emit(skeduler, event) {
                if (skeduler.isLoggingEvents === true) {
                    skeduler.eventLog.add(event)
                }
                if (skeduler.events.has(event)) {
                    const skedIds = skeduler.events.get(event)
                    const skedIdsStaying = []
                    for (let i = 0; i < skedIds.length; i++) {
                        if (skeduler.requests.has(skedIds[i])) {
                            const request = skeduler.requests.get(skedIds[i])
                            request.callback(event)
                            if (request.mode === G_sked__MODE_WAIT) {
                                skeduler.requests.delete(request.id)
                            } else {
                                skedIdsStaying.push(request.id)
                            }
                        }
                    }
                    skeduler.events.set(event, skedIdsStaying)
                }
            }
function G_sked_cancel(skeduler, id) {
                skeduler.requests.delete(id)
            }
function G_sked__createRequest(skeduler, event, callback, mode) {
                const id = G_sked__nextId(skeduler)
                const request = {
                    id, 
                    mode, 
                    callback,
                }
                skeduler.requests.set(id, request)
                if (!skeduler.events.has(event)) {
                    skeduler.events.set(event, [id])    
                } else {
                    skeduler.events.get(event).push(id)
                }
                return id
            }
function G_sked__nextId(skeduler) {
                return skeduler.idCounter++
            }
const G_commons__ARRAYS = new Map()
const G_commons__ARRAYS_SKEDULER = G_sked_create(false)
function G_commons_getArray(arrayName) {
            if (!G_commons__ARRAYS.has(arrayName)) {
                throw new Error('Unknown array ' + arrayName)
            }
            return G_commons__ARRAYS.get(arrayName)
        }
function G_commons_hasArray(arrayName) {
            return G_commons__ARRAYS.has(arrayName)
        }
function G_commons_setArray(arrayName, array) {
            G_commons__ARRAYS.set(arrayName, array)
            G_sked_emit(G_commons__ARRAYS_SKEDULER, arrayName)
        }
function G_commons_subscribeArrayChanges(arrayName, callback) {
            const id = G_sked_subscribe(G_commons__ARRAYS_SKEDULER, arrayName, callback)
            if (G_commons__ARRAYS.has(arrayName)) {
                callback(arrayName)
            }
            return id
        }
function G_commons_cancelArrayChangesSubscription(id) {
            G_sked_cancel(G_commons__ARRAYS_SKEDULER, id)
        }

const G_commons__FRAME_SKEDULER = G_sked_create(false)
function G_commons__emitFrame(frame) {
            G_sked_emit(G_commons__FRAME_SKEDULER, frame.toString())
        }
function G_commons_waitFrame(frame, callback) {
            return G_sked_waitFuture(G_commons__FRAME_SKEDULER, frame.toString(), callback)
        }
function G_commons_cancelWaitFrame(id) {
            G_sked_cancel(G_commons__FRAME_SKEDULER, id)
        }
const G_msg_FLOAT_TOKEN = "number"
const G_msg_STRING_TOKEN = "string"
function G_msg_create(template) {
                    const m = []
                    let i = 0
                    while (i < template.length) {
                        if (template[i] === G_msg_STRING_TOKEN) {
                            m.push('')
                            i += 2
                        } else if (template[i] === G_msg_FLOAT_TOKEN) {
                            m.push(0)
                            i += 1
                        }
                    }
                    return m
                }
function G_msg_getLength(message) {
                    return message.length
                }
function G_msg_getTokenType(message, tokenIndex) {
                    return typeof message[tokenIndex]
                }
function G_msg_isStringToken(message, tokenIndex) {
                    return G_msg_getTokenType(message, tokenIndex) === 'string'
                }
function G_msg_isFloatToken(message, tokenIndex) {
                    return G_msg_getTokenType(message, tokenIndex) === 'number'
                }
function G_msg_isMatching(message, tokenTypes) {
                    return (message.length === tokenTypes.length) 
                        && message.every((v, i) => G_msg_getTokenType(message, i) === tokenTypes[i])
                }
function G_msg_writeFloatToken(message, tokenIndex, value) {
                    message[tokenIndex] = value
                }
function G_msg_writeStringToken(message, tokenIndex, value) {
                    message[tokenIndex] = value
                }
function G_msg_readFloatToken(message, tokenIndex) {
                    return message[tokenIndex]
                }
function G_msg_readStringToken(message, tokenIndex) {
                    return message[tokenIndex]
                }
function G_msg_floats(values) {
                    return values
                }
function G_msg_strings(values) {
                    return values
                }
function G_msg_display(message) {
                    return '[' + message
                        .map(t => typeof t === 'string' ? '"' + t + '"' : t.toString())
                        .join(', ') + ']'
                }
function G_msg_VOID_MESSAGE_RECEIVER(m) {}
let G_msg_EMPTY_MESSAGE = G_msg_create([])
function G_bangUtils_isBang(message) {
            return (
                G_msg_isStringToken(message, 0) 
                && G_msg_readStringToken(message, 0) === 'bang'
            )
        }
function G_bangUtils_bang() {
            const message = G_msg_create([G_msg_STRING_TOKEN, 4])
            G_msg_writeStringToken(message, 0, 'bang')
            return message
        }
function G_bangUtils_emptyToBang(message) {
            if (G_msg_getLength(message) === 0) {
                return G_bangUtils_bang()
            } else {
                return message
            }
        }
const G_msgBuses__BUSES = new Map()
function G_msgBuses_publish(busName, message) {
            let i = 0
            const callbacks = G_msgBuses__BUSES.has(busName) ? G_msgBuses__BUSES.get(busName): []
            for (i = 0; i < callbacks.length; i++) {
                callbacks[i](message)
            }
        }
function G_msgBuses_subscribe(busName, callback) {
            if (!G_msgBuses__BUSES.has(busName)) {
                G_msgBuses__BUSES.set(busName, [])
            }
            G_msgBuses__BUSES.get(busName).push(callback)
        }
function G_msgBuses_unsubscribe(busName, callback) {
            if (!G_msgBuses__BUSES.has(busName)) {
                return
            }
            const callbacks = G_msgBuses__BUSES.get(busName)
            const found = callbacks.indexOf(callback)
            if (found !== -1) {
                callbacks.splice(found, 1)
            }
        }
function G_msgUtils_slice(message, start, end) {
            if (G_msg_getLength(message) <= start) {
                throw new Error('message empty')
            }
            const template = G_msgUtils__copyTemplate(message, start, end)
            const newMessage = G_msg_create(template)
            G_msgUtils_copy(message, newMessage, start, end, 0)
            return newMessage
        }
function G_msgUtils_concat(message1, message2) {
            const newMessage = G_msg_create(G_msgUtils__copyTemplate(message1, 0, G_msg_getLength(message1)).concat(G_msgUtils__copyTemplate(message2, 0, G_msg_getLength(message2))))
            G_msgUtils_copy(message1, newMessage, 0, G_msg_getLength(message1), 0)
            G_msgUtils_copy(message2, newMessage, 0, G_msg_getLength(message2), G_msg_getLength(message1))
            return newMessage
        }
function G_msgUtils_shift(message) {
            switch (G_msg_getLength(message)) {
                case 0:
                    throw new Error('message empty')
                case 1:
                    return G_msg_create([])
                default:
                    return G_msgUtils_slice(message, 1, G_msg_getLength(message))
            }
        }
function G_msgUtils_copy(src, dest, srcStart, srcEnd, destStart) {
            let i = srcStart
            let j = destStart
            for (i, j; i < srcEnd; i++, j++) {
                if (G_msg_getTokenType(src, i) === G_msg_STRING_TOKEN) {
                    G_msg_writeStringToken(dest, j, G_msg_readStringToken(src, i))
                } else {
                    G_msg_writeFloatToken(dest, j, G_msg_readFloatToken(src, i))
                }
            }
        }
function G_msgUtils__copyTemplate(src, start, end) {
            const template = []
            for (let i = start; i < end; i++) {
                const tokenType = G_msg_getTokenType(src, i)
                template.push(tokenType)
                if (tokenType === G_msg_STRING_TOKEN) {
                    template.push(G_msg_readStringToken(src, i).length)
                }
            }
            return template
        }
function computeUnitInSamples(sampleRate, amount, unit) {
        if (unit.slice(0, 3) === 'per') {
            if (amount !== 0) {
                amount = 1 / amount
            }
            unit = unit.slice(3)
        }

        if (unit === 'msec' || unit === 'milliseconds' || unit === 'millisecond') {
            return amount / 1000 * sampleRate
        } else if (unit === 'sec' || unit === 'seconds' || unit === 'second') {
            return amount * sampleRate
        } else if (unit === 'min' || unit === 'minutes' || unit === 'minute') {
            return amount * 60 * sampleRate
        } else if (unit === 'samp' || unit === 'samples' || unit === 'sample') {
            return amount
        } else {
            throw new Error("invalid time unit : " + unit)
        }
    }
function G_actionUtils_isAction(message, action) {
            return G_msg_isMatching(message, [G_msg_STRING_TOKEN])
                && G_msg_readStringToken(message, 0) === action
        }
function G_tokenConversion_toFloat(m, i) {
        if (G_msg_isFloatToken(m, i)) {
            return G_msg_readFloatToken(m, i)
        } else {
            return 0
        }
    }
function G_tokenConversion_toString_(m, i) {
        if (G_msg_isStringToken(m, i)) {
            const str = G_msg_readStringToken(m, i)
            if (str === 'bang') {
                return 'symbol'
            } else {
                return str
            }
        } else {
            return 'float'
        }
    }
function G_funcs_mtof(value) {
        return value <= -1500 ? 0: (value > 1499 ? 3.282417553401589e+38 : Math.pow(2, (value - 69) / 12) * 440)
    }

function G_points_interpolateLin(x, p0, p1) {
        return p0.y + (x - p0.x) * (p1.y - p0.y) / (p1.x - p0.x)
    }

function G_linesUtils_computeSlope(p0, p1) {
            return p1.x !== p0.x ? (p1.y - p0.y) / (p1.x - p0.x) : 0
        }
function G_linesUtils_removePointsBeforeFrame(points, frame) {
            const newPoints = []
            let i = 0
            while (i < points.length) {
                if (frame <= points[i].x) {
                    newPoints.push(points[i])
                }
                i++
            }
            return newPoints
        }
function G_linesUtils_insertNewLinePoints(points, p0, p1) {
            const newPoints = []
            let i = 0
            
            // Keep the points that are before the new points added
            while (i < points.length && points[i].x <= p0.x) {
                newPoints.push(points[i])
                i++
            }
            
            // Find the start value of the start point :
            
            // 1. If there is a previous point and that previous point
            // is on the same frame, we don't modify the start point value.
            // (represents a vertical line).
            if (0 < i - 1 && points[i - 1].x === p0.x) {

            // 2. If new points are inserted in between already existing points 
            // we need to interpolate the existing line to find the startValue.
            } else if (0 < i && i < points.length) {
                newPoints.push({
                    x: p0.x,
                    y: G_points_interpolateLin(p0.x, points[i - 1], points[i])
                })

            // 3. If new line is inserted after all existing points, 
            // we just take the value of the last point
            } else if (i >= points.length && points.length) {
                newPoints.push({
                    x: p0.x,
                    y: points[points.length - 1].y,
                })

            // 4. If new line placed in first position, we take the defaultStartValue.
            } else if (i === 0) {
                newPoints.push({
                    x: p0.x,
                    y: p0.y,
                })
            }
            
            newPoints.push({
                x: p1.x,
                y: p1.y,
            })
            return newPoints
        }
function G_linesUtils_computeFrameAjustedPoints(points) {
            if (points.length < 2) {
                throw new Error('invalid length for points')
            }

            const newPoints = []
            let i = 0
            let p = points[0]
            let frameLower = 0
            let frameUpper = 0
            
            while(i < points.length) {
                p = points[i]
                frameLower = Math.floor(p.x)
                frameUpper = frameLower + 1

                // I. Placing interpolated point at the lower bound of the current frame
                // ------------------------------------------------------------------------
                // 1. Point is already on an exact frame,
                if (p.x === frameLower) {
                    newPoints.push({ x: p.x, y: p.y })

                    // 1.a. if several of the next points are also on the same X,
                    // we find the last one to draw a vertical line.
                    while (
                        (i + 1) < points.length
                        && points[i + 1].x === frameLower
                    ) {
                        i++
                    }
                    if (points[i].y !== newPoints[newPoints.length - 1].y) {
                        newPoints.push({ x: points[i].x, y: points[i].y })
                    }

                    // 1.b. if last point, we quit
                    if (i + 1 >= points.length) {
                        break
                    }

                    // 1.c. if next point is in a different frame we can move on to next iteration
                    if (frameUpper <= points[i + 1].x) {
                        i++
                        continue
                    }
                
                // 2. Point isn't on an exact frame
                // 2.a. There's a previous point, the we use it to interpolate the value.
                } else if (newPoints.length) {
                    newPoints.push({
                        x: frameLower,
                        y: G_points_interpolateLin(frameLower, points[i - 1], p),
                    })
                
                // 2.b. It's the very first point, then we don't change its value.
                } else {
                    newPoints.push({ x: frameLower, y: p.y })
                }

                // II. Placing interpolated point at the upper bound of the current frame
                // ---------------------------------------------------------------------------
                // First, we find the closest point from the frame upper bound (could be the same p).
                // Or could be a point that is exactly placed on frameUpper.
                while (
                    (i + 1) < points.length 
                    && (
                        Math.ceil(points[i + 1].x) === frameUpper
                        || Math.floor(points[i + 1].x) === frameUpper
                    )
                ) {
                    i++
                }
                p = points[i]

                // 1. If the next point is directly in the next frame, 
                // we do nothing, as this corresponds with next iteration frameLower.
                if (Math.floor(p.x) === frameUpper) {
                    continue
                
                // 2. If there's still a point after p, we use it to interpolate the value
                } else if (i < points.length - 1) {
                    newPoints.push({
                        x: frameUpper,
                        y: G_points_interpolateLin(frameUpper, p, points[i + 1]),
                    })

                // 3. If it's the last point, we dont change the value
                } else {
                    newPoints.push({ x: frameUpper, y: p.y })
                }

                i++
            }

            return newPoints
        }
function G_linesUtils_computeLineSegments(points) {
            const lineSegments = []
            let i = 0
            let p0
            let p1

            while(i < points.length - 1) {
                p0 = points[i]
                p1 = points[i + 1]
                lineSegments.push({
                    p0, p1, 
                    dy: G_linesUtils_computeSlope(p0, p1),
                    dx: 1,
                })
                i++
            }
            return lineSegments
        }
        
function NT_vsl_setReceiveBusName(state, busName) {
            if (state.receiveBusName !== "empty") {
                G_msgBuses_unsubscribe(state.receiveBusName, state.messageReceiver)
            }
            state.receiveBusName = busName
            if (state.receiveBusName !== "empty") {
                G_msgBuses_subscribe(state.receiveBusName, state.messageReceiver)
            }
        }
function NT_vsl_setSendReceiveFromMessage(state, m) {
            if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'receive'
            ) {
                NT_vsl_setReceiveBusName(state, G_msg_readStringToken(m, 1))
                return true

            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'send'
            ) {
                state.sendBusName = G_msg_readStringToken(m, 1)
                return true
            }
            return false
        }
function NT_vsl_defaultMessageHandler(m) {}
function NT_vsl_receiveMessage(state, m) {
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        state.valueFloat = G_msg_readFloatToken(m, 0)
                        const outMessage = G_msg_floats([state.valueFloat])
                        state.messageSender(outMessage)
                        if (state.sendBusName !== "empty") {
                            G_msgBuses_publish(state.sendBusName, outMessage)
                        }
                        return
        
                    } else if (G_bangUtils_isBang(m)) {
                        
                        const outMessage = G_msg_floats([state.valueFloat])
                        state.messageSender(outMessage)
                        if (state.sendBusName !== "empty") {
                            G_msgBuses_publish(state.sendBusName, outMessage)
                        }
                        return
        
                    } else if (
                        G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN]) 
                        && G_msg_readStringToken(m, 0) === 'set'
                    ) {
                        state.valueFloat = G_msg_readFloatToken(m, 1)
                        return
                    
                    } else if (NT_vsl_setSendReceiveFromMessage(state, m) === true) {
                        return
                    }
                }







function NT_floatatom_setReceiveBusName(state, busName) {
            if (state.receiveBusName !== "empty") {
                G_msgBuses_unsubscribe(state.receiveBusName, state.messageReceiver)
            }
            state.receiveBusName = busName
            if (state.receiveBusName !== "empty") {
                G_msgBuses_subscribe(state.receiveBusName, state.messageReceiver)
            }
        }
function NT_floatatom_setSendReceiveFromMessage(state, m) {
            if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'receive'
            ) {
                NT_floatatom_setReceiveBusName(state, G_msg_readStringToken(m, 1))
                return true

            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'send'
            ) {
                state.sendBusName = G_msg_readStringToken(m, 1)
                return true
            }
            return false
        }
function NT_floatatom_defaultMessageHandler(m) {}
function NT_floatatom_receiveMessage(state, m) {
                    if (G_bangUtils_isBang(m)) {
                        state.messageSender(state.value)
                        if (state.sendBusName !== "empty") {
                            G_msgBuses_publish(state.sendBusName, state.value)
                        }
                        return
                    
                    } else if (
                        G_msg_getTokenType(m, 0) === G_msg_STRING_TOKEN
                        && G_msg_readStringToken(m, 0) === 'set'
                    ) {
                        const setMessage = G_msgUtils_slice(m, 1, G_msg_getLength(m))
                        if (G_msg_isMatching(setMessage, [G_msg_FLOAT_TOKEN])) { 
                                state.value = setMessage    
                                return
                        }
        
                    } else if (NT_floatatom_setSendReceiveFromMessage(state, m) === true) {
                        return
                        
                    } else if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                    
                        state.value = m
                        state.messageSender(state.value)
                        if (state.sendBusName !== "empty") {
                            G_msgBuses_publish(state.sendBusName, state.value)
                        }
                        return
        
                    }
                }

function NT_nbx_setReceiveBusName(state, busName) {
            if (state.receiveBusName !== "empty") {
                G_msgBuses_unsubscribe(state.receiveBusName, state.messageReceiver)
            }
            state.receiveBusName = busName
            if (state.receiveBusName !== "empty") {
                G_msgBuses_subscribe(state.receiveBusName, state.messageReceiver)
            }
        }
function NT_nbx_setSendReceiveFromMessage(state, m) {
            if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'receive'
            ) {
                NT_nbx_setReceiveBusName(state, G_msg_readStringToken(m, 1))
                return true

            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'send'
            ) {
                state.sendBusName = G_msg_readStringToken(m, 1)
                return true
            }
            return false
        }
function NT_nbx_defaultMessageHandler(m) {}
function NT_nbx_receiveMessage(state, m) {
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        state.valueFloat = Math.min(Math.max(G_msg_readFloatToken(m, 0),state.minValue),state.maxValue)
                        const outMessage = G_msg_floats([state.valueFloat])
                        state.messageSender(outMessage)
                        if (state.sendBusName !== "empty") {
                            G_msgBuses_publish(state.sendBusName, outMessage)
                        }
                        return
        
                    } else if (G_bangUtils_isBang(m)) {
                        
                        const outMessage = G_msg_floats([state.valueFloat])
                        state.messageSender(outMessage)
                        if (state.sendBusName !== "empty") {
                            G_msgBuses_publish(state.sendBusName, outMessage)
                        }
                        return
        
                    } else if (
                        G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN]) 
                        && G_msg_readStringToken(m, 0) === 'set'
                    ) {
                        state.valueFloat = Math.min(Math.max(G_msg_readFloatToken(m, 1),state.minValue),state.maxValue)
                        return
                    
                    } else if (NT_nbx_setSendReceiveFromMessage(state, m) === true) {
                        return
                    }
                }



function NT_metro_setRate(state, rate) {
                state.rate = Math.max(rate, 0)
            }
function NT_metro_scheduleNextTick(state) {
                state.snd0(G_bangUtils_bang())
                state.realNextTick = state.realNextTick + state.rate * state.sampleRatio
                state.skedId = G_commons_waitFrame(
                    toInt(Math.round(state.realNextTick)), 
                    state.tickCallback,
                )
            }
function NT_metro_stop(state) {
                if (state.skedId !== G_sked_ID_NULL) {
                    G_commons_cancelWaitFrame(state.skedId)
                    state.skedId = G_sked_ID_NULL
                }
                state.realNextTick = 0
            }

function NT_bang_setReceiveBusName(state, busName) {
            if (state.receiveBusName !== "empty") {
                G_msgBuses_unsubscribe(state.receiveBusName, state.messageReceiver)
            }
            state.receiveBusName = busName
            if (state.receiveBusName !== "empty") {
                G_msgBuses_subscribe(state.receiveBusName, state.messageReceiver)
            }
        }
function NT_bang_setSendReceiveFromMessage(state, m) {
            if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'receive'
            ) {
                NT_bang_setReceiveBusName(state, G_msg_readStringToken(m, 1))
                return true

            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_STRING_TOKEN])
                && G_msg_readStringToken(m, 0) === 'send'
            ) {
                state.sendBusName = G_msg_readStringToken(m, 1)
                return true
            }
            return false
        }
function NT_bang_defaultMessageHandler(m) {}
function NT_bang_receiveMessage(state, m) {
                if (NT_bang_setSendReceiveFromMessage(state, m) === true) {
                    return
                }
                
                const outMessage = G_bangUtils_bang()
                state.messageSender(outMessage)
                if (state.sendBusName !== "empty") {
                    G_msgBuses_publish(state.sendBusName, outMessage)
                }
                return
            }

function NT_float_setValue(state, value) {
                state.value = value
            }

function NT_add_setLeft(state, value) {
                    state.leftOp = value
                }
function NT_add_setRight(state, value) {
                    state.rightOp = value
                }

function NT_mod_setLeft(state, value) {
                    state.leftOp = value > 0 ? Math.floor(value): Math.ceil(value)
                }
function NT_mod_setRight(state, value) {
                    state.rightOp = Math.floor(Math.abs(value))
                }





function NT_random_setMaxValue(state, maxValue) {
                state.maxValue = Math.max(maxValue, 0)
            }





const NT_line_t_defaultLine = {
                p0: {x: -1, y: 0},
                p1: {x: -1, y: 0},
                dx: 1,
                dy: 0,
            }
function NT_line_t_setNewLine(state, targetValue) {
                const startFrame = toFloat(FRAME)
                const endFrame = toFloat(FRAME) + state.nextDurationSamp
                if (endFrame === toFloat(FRAME)) {
                    state.currentLine = NT_line_t_defaultLine
                    state.currentValue = targetValue
                    state.nextDurationSamp = 0
                } else {
                    state.currentLine = {
                        p0: {
                            x: startFrame, 
                            y: state.currentValue,
                        }, 
                        p1: {
                            x: endFrame, 
                            y: targetValue,
                        }, 
                        dx: 1,
                        dy: 0,
                    }
                    state.currentLine.dy = G_linesUtils_computeSlope(state.currentLine.p0, state.currentLine.p1)
                    state.nextDurationSamp = 0
                }
            }
function NT_line_t_setNextDuration(state, durationMsec) {
                state.nextDurationSamp = computeUnitInSamples(SAMPLE_RATE, durationMsec, 'msec')
            }
function NT_line_t_stop(state) {
                state.currentLine.p1.x = -1
                state.currentLine.p1.y = state.currentValue
            }



function NT_osc_t_setStep(state, freq) {
                    state.step = (2 * Math.PI / SAMPLE_RATE) * freq
                }
function NT_osc_t_setPhase(state, phase) {
                    state.phase = phase % 1.0 * 2 * Math.PI
                }









        const N_n_0_3_state = {
                                minValue: 0,
maxValue: 127,
valueFloat: 0,
value: G_msg_create([]),
receiveBusName: "empty",
sendBusName: "empty",
messageReceiver: NT_vsl_defaultMessageHandler,
messageSender: NT_vsl_defaultMessageHandler,
                            }
const N_n_1_0_state = {
                                minValue: 0,
maxValue: 10000,
valueFloat: 0,
value: G_msg_create([]),
receiveBusName: "empty",
sendBusName: "empty",
messageReceiver: NT_vsl_defaultMessageHandler,
messageSender: NT_vsl_defaultMessageHandler,
                            }
const N_m_n_1_5_0_sig_state = {
                                currentValue: 0,
                            }
const N_n_0_4_state = {
                                minValue: 0,
maxValue: 127,
valueFloat: 0,
value: G_msg_create([]),
receiveBusName: "empty",
sendBusName: "empty",
messageReceiver: NT_vsl_defaultMessageHandler,
messageSender: NT_vsl_defaultMessageHandler,
                            }
const N_n_1_3_state = {
                                minValue: 0,
maxValue: 1,
valueFloat: 0,
value: G_msg_create([]),
receiveBusName: "empty",
sendBusName: "empty",
messageReceiver: NT_vsl_defaultMessageHandler,
messageSender: NT_vsl_defaultMessageHandler,
                            }
const N_m_n_1_2_1_sig_state = {
                                currentValue: 0,
                            }
const N_n_1_4_state = {
                                value: G_msg_floats([0]),
receiveBusName: "empty",
sendBusName: "empty",
messageReceiver: NT_floatatom_defaultMessageHandler,
messageSender: NT_floatatom_defaultMessageHandler,
                            }
const N_n_1_12_state = {
                                value: G_msg_floats([0]),
receiveBusName: "empty",
sendBusName: "empty",
messageReceiver: NT_floatatom_defaultMessageHandler,
messageSender: NT_floatatom_defaultMessageHandler,
                            }
const N_n_1_16_state = {
                                minValue: 0,
maxValue: 10000,
valueFloat: 0,
value: G_msg_create([]),
receiveBusName: "empty",
sendBusName: "empty",
messageReceiver: NT_vsl_defaultMessageHandler,
messageSender: NT_vsl_defaultMessageHandler,
                            }
const N_m_n_1_21_0_sig_state = {
                                currentValue: 0,
                            }
const N_n_1_19_state = {
                                minValue: 0,
maxValue: 1,
valueFloat: 0,
value: G_msg_create([]),
receiveBusName: "empty",
sendBusName: "empty",
messageReceiver: NT_vsl_defaultMessageHandler,
messageSender: NT_vsl_defaultMessageHandler,
                            }
const N_m_n_1_18_1_sig_state = {
                                currentValue: 0,
                            }
const N_n_1_20_state = {
                                value: G_msg_floats([0]),
receiveBusName: "empty",
sendBusName: "empty",
messageReceiver: NT_floatatom_defaultMessageHandler,
messageSender: NT_floatatom_defaultMessageHandler,
                            }
const N_n_1_27_state = {
                                value: G_msg_floats([0]),
receiveBusName: "empty",
sendBusName: "empty",
messageReceiver: NT_floatatom_defaultMessageHandler,
messageSender: NT_floatatom_defaultMessageHandler,
                            }
const N_n_2_9_state = {
                                minValue: -1e+37,
maxValue: 1e+37,
valueFloat: 0,
value: G_msg_create([]),
receiveBusName: "empty",
sendBusName: "empty",
messageReceiver: NT_nbx_defaultMessageHandler,
messageSender: NT_nbx_defaultMessageHandler,
                            }
const N_n_2_12_state = {
                                rate: 0,
sampleRatio: 1,
skedId: G_sked_ID_NULL,
realNextTick: -1,
snd0: function (m) {},
tickCallback: function () {},
                            }
const N_n_2_32_state = {
                                value: G_msg_create([]),
receiveBusName: "empty",
sendBusName: "empty",
messageReceiver: NT_bang_defaultMessageHandler,
messageSender: NT_bang_defaultMessageHandler,
                            }
const N_n_2_33_state = {
                                value: 0,
                            }
const N_n_2_34_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_2_37_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_2_36_state = {
                                value: G_msg_floats([0]),
receiveBusName: "empty",
sendBusName: "empty",
messageReceiver: NT_floatatom_defaultMessageHandler,
messageSender: NT_floatatom_defaultMessageHandler,
                            }
const N_n_2_15_state = {
                                floatFilter: 64,
stringFilter: "64",
filterType: G_msg_FLOAT_TOKEN,
                            }
const N_n_2_13_state = {
                                value: G_msg_create([]),
receiveBusName: "empty",
sendBusName: "empty",
messageReceiver: NT_bang_defaultMessageHandler,
messageSender: NT_bang_defaultMessageHandler,
                            }
const N_n_2_8_state = {
                                maxValue: 6,
                            }
const N_n_2_14_state = {
                                floatFilter: 0,
stringFilter: "0",
filterType: G_msg_FLOAT_TOKEN,
                            }
const N_n_2_0_state = {
                                msgSpecs: [],
                            }
const N_n_2_25_state = {
                                leftOp: 0,
rightOp: 0,
                            }
const N_n_2_27_state = {
                                value: G_msg_floats([0]),
receiveBusName: "empty",
sendBusName: "empty",
messageReceiver: NT_floatatom_defaultMessageHandler,
messageSender: NT_floatatom_defaultMessageHandler,
                            }
const N_n_1_14_state = {
                                msgSpecs: [],
                            }
const N_n_1_13_state = {
                                currentLine: NT_line_t_defaultLine,
currentValue: 0,
nextDurationSamp: 0,
                            }
const N_m_n_1_15_0_sig_state = {
                                currentValue: 0,
                            }
const N_n_2_30_state = {
                                minValue: -1e+37,
maxValue: 1e+37,
valueFloat: 0,
value: G_msg_create([]),
receiveBusName: "empty",
sendBusName: "empty",
messageReceiver: NT_nbx_defaultMessageHandler,
messageSender: NT_nbx_defaultMessageHandler,
                            }
const N_n_2_1_state = {
                                msgSpecs: [],
                            }
const N_n_2_2_state = {
                                msgSpecs: [],
                            }
const N_n_2_3_state = {
                                msgSpecs: [],
                            }
const N_n_2_4_state = {
                                msgSpecs: [],
                            }
const N_n_2_5_state = {
                                msgSpecs: [],
                            }
const N_n_2_6_state = {
                                msgSpecs: [],
                            }
const N_n_2_7_state = {
                                msgSpecs: [],
                            }
const N_n_2_28_state = {
                                maxValue: 6,
                            }
const N_n_2_24_state = {
                                floatFilter: 0,
stringFilter: "0",
filterType: G_msg_FLOAT_TOKEN,
                            }
const N_n_2_16_state = {
                                msgSpecs: [],
                            }
const N_n_2_17_state = {
                                msgSpecs: [],
                            }
const N_n_2_18_state = {
                                msgSpecs: [],
                            }
const N_n_2_19_state = {
                                msgSpecs: [],
                            }
const N_n_2_21_state = {
                                msgSpecs: [],
                            }
const N_n_2_22_state = {
                                msgSpecs: [],
                            }
const N_n_2_23_state = {
                                msgSpecs: [],
                            }
const N_n_2_11_state = {
                                value: G_msg_create([]),
receiveBusName: "empty",
sendBusName: "empty",
messageReceiver: NT_bang_defaultMessageHandler,
messageSender: NT_bang_defaultMessageHandler,
                            }
const N_n_1_15_state = {
                                phase: 0,
step: 0,
                            }
const N_n_1_5_state = {
                                phase: 0,
step: 0,
                            }
const N_n_1_11_state = {
                                currentValue: 0,
                            }
const N_n_1_28_state = {
                                currentLine: NT_line_t_defaultLine,
currentValue: 0,
nextDurationSamp: 0,
                            }
const N_n_1_26_state = {
                                currentValue: 0,
                            }
        
function N_n_0_3_rcvs_0(m) {
                            
                NT_vsl_receiveMessage(N_n_0_3_state, m)
                return
            
                            throw new Error('Node "n_0_3", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_1_0_rcvs_0(m) {
                            
                NT_vsl_receiveMessage(N_n_1_0_state, m)
                return
            
                            throw new Error('Node "n_1_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_1_5_0__routemsg_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                N_m_n_1_5_0__routemsg_snds_0(m)
                return
            } else {
                G_msg_VOID_MESSAGE_RECEIVER(m)
                return
            }
        
                            throw new Error('Node "m_n_1_5_0__routemsg", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
let N_m_n_1_5_0_sig_outs_0 = 0
function N_m_n_1_5_0_sig_rcvs_0(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        N_m_n_1_5_0_sig_state.currentValue = G_msg_readFloatToken(m, 0)
        return
    }

                            throw new Error('Node "m_n_1_5_0_sig", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_3_0_rcvs_0(m) {
                            
                IO_snd_n_0_3_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_3_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_0_4_rcvs_0(m) {
                            
                NT_vsl_receiveMessage(N_n_0_4_state, m)
                return
            
                            throw new Error('Node "n_0_4", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_1_3_rcvs_0(m) {
                            
                NT_vsl_receiveMessage(N_n_1_3_state, m)
                return
            
                            throw new Error('Node "n_1_3", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_1_2_1__routemsg_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                N_m_n_1_2_1_sig_rcvs_0(m)
                return
            } else {
                G_msg_VOID_MESSAGE_RECEIVER(m)
                return
            }
        
                            throw new Error('Node "m_n_1_2_1__routemsg", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_1_2_1_sig_rcvs_0(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        N_m_n_1_2_1_sig_state.currentValue = G_msg_readFloatToken(m, 0)
        return
    }

                            throw new Error('Node "m_n_1_2_1_sig", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_1_4_rcvs_0(m) {
                            
                NT_floatatom_receiveMessage(N_n_1_4_state, m)
                return
            
                            throw new Error('Node "n_1_4", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_ioSnd_n_0_4_0_rcvs_0(m) {
                            
                IO_snd_n_0_4_0(m)
                return
            
                            throw new Error('Node "n_ioSnd_n_0_4_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_1_12_rcvs_0(m) {
                            
                NT_floatatom_receiveMessage(N_n_1_12_state, m)
                return
            
                            throw new Error('Node "n_1_12", inlet "0", unsupported message : ' + G_msg_display(m))
                        }



function N_m_n_1_21_0__routemsg_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                N_m_n_1_21_0_sig_rcvs_0(m)
                return
            } else {
                G_msg_VOID_MESSAGE_RECEIVER(m)
                return
            }
        
                            throw new Error('Node "m_n_1_21_0__routemsg", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_1_21_0_sig_rcvs_0(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        N_m_n_1_21_0_sig_state.currentValue = G_msg_readFloatToken(m, 0)
        return
    }

                            throw new Error('Node "m_n_1_21_0_sig", inlet "0", unsupported message : ' + G_msg_display(m))
                        }



function N_m_n_1_18_1__routemsg_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                N_m_n_1_18_1_sig_rcvs_0(m)
                return
            } else {
                G_msg_VOID_MESSAGE_RECEIVER(m)
                return
            }
        
                            throw new Error('Node "m_n_1_18_1__routemsg", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_1_18_1_sig_rcvs_0(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        N_m_n_1_18_1_sig_state.currentValue = G_msg_readFloatToken(m, 0)
        return
    }

                            throw new Error('Node "m_n_1_18_1_sig", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_1_20_rcvs_0(m) {
                            
                NT_floatatom_receiveMessage(N_n_1_20_state, m)
                return
            
                            throw new Error('Node "n_1_20", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_1_27_rcvs_0(m) {
                            
                NT_floatatom_receiveMessage(N_n_1_27_state, m)
                return
            
                            throw new Error('Node "n_1_27", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_9_rcvs_0(m) {
                            
                NT_nbx_receiveMessage(N_n_2_9_state, m)
                return
            
                            throw new Error('Node "n_2_9", inlet "0", unsupported message : ' + G_msg_display(m))
                        }



function N_n_2_12_rcvs_0(m) {
                            
            if (G_msg_getLength(m) === 1) {
                if (
                    (G_msg_isFloatToken(m, 0) && G_msg_readFloatToken(m, 0) === 0)
                    || G_actionUtils_isAction(m, 'stop')
                ) {
                    NT_metro_stop(N_n_2_12_state)
                    return
    
                } else if (
                    G_msg_isFloatToken(m, 0)
                    || G_bangUtils_isBang(m)
                ) {
                    N_n_2_12_state.realNextTick = toFloat(FRAME)
                    NT_metro_scheduleNextTick(N_n_2_12_state)
                    return
                }
            }
        
                            throw new Error('Node "n_2_12", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_32_rcvs_0(m) {
                            
            NT_bang_receiveMessage(N_n_2_32_state, m)
            return
        
                            throw new Error('Node "n_2_32", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_33_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                NT_float_setValue(N_n_2_33_state, G_msg_readFloatToken(m, 0))
                N_n_2_34_rcvs_0(G_msg_floats([N_n_2_33_state.value]))
                return 

            } else if (G_bangUtils_isBang(m)) {
                N_n_2_34_rcvs_0(G_msg_floats([N_n_2_33_state.value]))
                return
                
            }
        
                            throw new Error('Node "n_2_33", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
function N_n_2_33_rcvs_1(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        NT_float_setValue(N_n_2_33_state, G_msg_readFloatToken(m, 0))
        return
    }

                            throw new Error('Node "n_2_33", inlet "1", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_34_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_add_setLeft(N_n_2_34_state, G_msg_readFloatToken(m, 0))
                        N_n_2_37_rcvs_0(G_msg_floats([N_n_2_34_state.leftOp + N_n_2_34_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_2_37_rcvs_0(G_msg_floats([N_n_2_34_state.leftOp + N_n_2_34_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_2_34", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_37_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_mod_setLeft(N_n_2_37_state, G_msg_readFloatToken(m, 0))
                        N_n_2_35_rcvs_0(G_msg_floats([N_n_2_37_state.rightOp !== 0 ? (N_n_2_37_state.rightOp + (N_n_2_37_state.leftOp % N_n_2_37_state.rightOp)) % N_n_2_37_state.rightOp: 0]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_2_35_rcvs_0(G_msg_floats([N_n_2_37_state.rightOp !== 0 ? (N_n_2_37_state.rightOp + (N_n_2_37_state.leftOp % N_n_2_37_state.rightOp)) % N_n_2_37_state.rightOp: 0]))
                        return
                    }
                
                            throw new Error('Node "n_2_37", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_35_rcvs_0(m) {
                            
            N_n_2_33_rcvs_1(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
N_n_2_36_rcvs_0(G_msg_floats([G_tokenConversion_toFloat(m, 0)]))
            return
        
                            throw new Error('Node "n_2_35", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_36_rcvs_0(m) {
                            
                NT_floatatom_receiveMessage(N_n_2_36_state, m)
                return
            
                            throw new Error('Node "n_2_36", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_15_rcvs_0(m) {
                            
                    if (N_n_2_15_state.filterType === G_msg_STRING_TOKEN) {
                        if (
                            (N_n_2_15_state.stringFilter === 'float'
                                && G_msg_isFloatToken(m, 0))
                            || (N_n_2_15_state.stringFilter === 'symbol'
                                && G_msg_isStringToken(m, 0))
                            || (N_n_2_15_state.stringFilter === 'list'
                                && G_msg_getLength(m) > 1)
                            || (N_n_2_15_state.stringFilter === 'bang' 
                                && G_bangUtils_isBang(m))
                        ) {
                            N_n_2_13_rcvs_0(m)
                            return
                        
                        } else if (
                            G_msg_isStringToken(m, 0)
                            && G_msg_readStringToken(m, 0) === N_n_2_15_state.stringFilter
                        ) {
                            N_n_2_13_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                            return
                        }
    
                    } else if (
                        G_msg_isFloatToken(m, 0)
                        && G_msg_readFloatToken(m, 0) === N_n_2_15_state.floatFilter
                    ) {
                        N_n_2_13_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                        return
                    }
                
                    G_msg_VOID_MESSAGE_RECEIVER(m)
                return
                
                            throw new Error('Node "n_2_15", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_13_rcvs_0(m) {
                            
            NT_bang_receiveMessage(N_n_2_13_state, m)
            return
        
                            throw new Error('Node "n_2_13", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_8_rcvs_0(m) {
                            
            if (G_bangUtils_isBang(m)) {
                N_n_2_8_snds_0(G_msg_floats([Math.floor(Math.random() * N_n_2_8_state.maxValue)]))
                return
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN])
                && G_msg_readStringToken(m, 0) === 'seed'
            ) {
                console.log('WARNING : seed not implemented yet for [random]')
                return
            }
        
                            throw new Error('Node "n_2_8", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_14_rcvs_0(m) {
                            
                    
                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 0
                            ) {
                                N_n_2_0_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 1
                            ) {
                                N_n_2_1_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 2
                            ) {
                                N_n_2_2_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 3
                            ) {
                                N_n_2_3_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 4
                            ) {
                                N_n_2_4_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 5
                            ) {
                                N_n_2_5_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 6
                            ) {
                                N_n_2_6_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 7
                            ) {
                                N_n_2_7_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        
    
                    G_msg_VOID_MESSAGE_RECEIVER(m)
                    return
                
                            throw new Error('Node "n_2_14", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_0_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_2_0_state.msgSpecs.splice(0, N_n_2_0_state.msgSpecs.length - 1)
                    N_n_2_0_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_2_0_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_2_0_state.msgSpecs.length; i++) {
                        if (N_n_2_0_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_2_0_state.msgSpecs[i].send, N_n_2_0_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_2_25_rcvs_0(N_n_2_0_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_2_0", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_25_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        NT_add_setLeft(N_n_2_25_state, G_msg_readFloatToken(m, 0))
                        N_n_2_27_rcvs_0(G_msg_floats([N_n_2_25_state.leftOp + N_n_2_25_state.rightOp]))
                        return
                    
                    } else if (G_bangUtils_isBang(m)) {
                        N_n_2_27_rcvs_0(G_msg_floats([N_n_2_25_state.leftOp + N_n_2_25_state.rightOp]))
                        return
                    }
                
                            throw new Error('Node "n_2_25", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
function N_n_2_25_rcvs_1(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        NT_add_setRight(N_n_2_25_state, G_msg_readFloatToken(m, 0))
        return
    }

                            throw new Error('Node "n_2_25", inlet "1", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_27_rcvs_0(m) {
                            
                NT_floatatom_receiveMessage(N_n_2_27_state, m)
                return
            
                            throw new Error('Node "n_2_27", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_29_rcvs_0(m) {
                            
                    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                        const value = G_msg_readFloatToken(m, 0)
                        N_n_2_29_snds_0(G_msg_floats([G_funcs_mtof(value)]))
                        return
                    }
                
                            throw new Error('Node "n_2_29", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_1_14_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_1_14_state.msgSpecs.splice(0, N_n_1_14_state.msgSpecs.length - 1)
                    N_n_1_14_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_1_14_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_1_14_state.msgSpecs.length; i++) {
                        if (N_n_1_14_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_1_14_state.msgSpecs[i].send, N_n_1_14_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_1_13_rcvs_0(N_n_1_14_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_1_14", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
let N_n_1_13_outs_0 = 0
function N_n_1_13_rcvs_0(m) {
                            
            if (
                G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])
                || G_msg_isMatching(m, [G_msg_FLOAT_TOKEN, G_msg_FLOAT_TOKEN])
            ) {
                switch (G_msg_getLength(m)) {
                    case 2:
                        NT_line_t_setNextDuration(N_n_1_13_state, G_msg_readFloatToken(m, 1))
                    case 1:
                        NT_line_t_setNewLine(N_n_1_13_state, G_msg_readFloatToken(m, 0))
                }
                return
    
            } else if (G_actionUtils_isAction(m, 'stop')) {
                NT_line_t_stop(N_n_1_13_state)
                return
    
            }
        
                            throw new Error('Node "n_1_13", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_m_n_1_15_0__routemsg_rcvs_0(m) {
                            
            if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
                N_m_n_1_15_0__routemsg_snds_0(m)
                return
            } else {
                G_msg_VOID_MESSAGE_RECEIVER(m)
                return
            }
        
                            throw new Error('Node "m_n_1_15_0__routemsg", inlet "0", unsupported message : ' + G_msg_display(m))
                        }
let N_m_n_1_15_0_sig_outs_0 = 0
function N_m_n_1_15_0_sig_rcvs_0(m) {
                            
    if (G_msg_isMatching(m, [G_msg_FLOAT_TOKEN])) {
        N_m_n_1_15_0_sig_state.currentValue = G_msg_readFloatToken(m, 0)
        return
    }

                            throw new Error('Node "m_n_1_15_0_sig", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_30_rcvs_0(m) {
                            
                NT_nbx_receiveMessage(N_n_2_30_state, m)
                return
            
                            throw new Error('Node "n_2_30", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_1_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_2_1_state.msgSpecs.splice(0, N_n_2_1_state.msgSpecs.length - 1)
                    N_n_2_1_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_2_1_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_2_1_state.msgSpecs.length; i++) {
                        if (N_n_2_1_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_2_1_state.msgSpecs[i].send, N_n_2_1_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_2_25_rcvs_0(N_n_2_1_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_2_1", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_2_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_2_2_state.msgSpecs.splice(0, N_n_2_2_state.msgSpecs.length - 1)
                    N_n_2_2_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_2_2_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_2_2_state.msgSpecs.length; i++) {
                        if (N_n_2_2_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_2_2_state.msgSpecs[i].send, N_n_2_2_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_2_25_rcvs_0(N_n_2_2_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_2_2", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_3_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_2_3_state.msgSpecs.splice(0, N_n_2_3_state.msgSpecs.length - 1)
                    N_n_2_3_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_2_3_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_2_3_state.msgSpecs.length; i++) {
                        if (N_n_2_3_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_2_3_state.msgSpecs[i].send, N_n_2_3_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_2_25_rcvs_0(N_n_2_3_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_2_3", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_4_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_2_4_state.msgSpecs.splice(0, N_n_2_4_state.msgSpecs.length - 1)
                    N_n_2_4_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_2_4_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_2_4_state.msgSpecs.length; i++) {
                        if (N_n_2_4_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_2_4_state.msgSpecs[i].send, N_n_2_4_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_2_25_rcvs_0(N_n_2_4_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_2_4", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_5_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_2_5_state.msgSpecs.splice(0, N_n_2_5_state.msgSpecs.length - 1)
                    N_n_2_5_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_2_5_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_2_5_state.msgSpecs.length; i++) {
                        if (N_n_2_5_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_2_5_state.msgSpecs[i].send, N_n_2_5_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_2_25_rcvs_0(N_n_2_5_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_2_5", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_6_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_2_6_state.msgSpecs.splice(0, N_n_2_6_state.msgSpecs.length - 1)
                    N_n_2_6_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_2_6_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_2_6_state.msgSpecs.length; i++) {
                        if (N_n_2_6_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_2_6_state.msgSpecs[i].send, N_n_2_6_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_2_25_rcvs_0(N_n_2_6_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_2_6", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_7_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_2_7_state.msgSpecs.splice(0, N_n_2_7_state.msgSpecs.length - 1)
                    N_n_2_7_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_2_7_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_2_7_state.msgSpecs.length; i++) {
                        if (N_n_2_7_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_2_7_state.msgSpecs[i].send, N_n_2_7_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_2_25_rcvs_0(N_n_2_7_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_2_7", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_28_rcvs_0(m) {
                            
            if (G_bangUtils_isBang(m)) {
                N_n_2_24_rcvs_0(G_msg_floats([Math.floor(Math.random() * N_n_2_28_state.maxValue)]))
                return
            } else if (
                G_msg_isMatching(m, [G_msg_STRING_TOKEN, G_msg_FLOAT_TOKEN])
                && G_msg_readStringToken(m, 0) === 'seed'
            ) {
                console.log('WARNING : seed not implemented yet for [random]')
                return
            }
        
                            throw new Error('Node "n_2_28", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_24_rcvs_0(m) {
                            
                    
                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 0
                            ) {
                                G_msg_VOID_MESSAGE_RECEIVER(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 1
                            ) {
                                N_n_2_16_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 2
                            ) {
                                N_n_2_17_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 3
                            ) {
                                N_n_2_18_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 4
                            ) {
                                N_n_2_19_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 5
                            ) {
                                N_n_2_21_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        

                            if (
                                G_msg_isFloatToken(m, 0)
                                && G_msg_readFloatToken(m, 0) === 6
                            ) {
                                N_n_2_22_rcvs_0(G_bangUtils_emptyToBang(G_msgUtils_shift(m)))
                                return
                            }
                        
    
                    N_n_2_23_rcvs_0(m)
                    return
                
                            throw new Error('Node "n_2_24", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_16_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_2_16_state.msgSpecs.splice(0, N_n_2_16_state.msgSpecs.length - 1)
                    N_n_2_16_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_2_16_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_2_16_state.msgSpecs.length; i++) {
                        if (N_n_2_16_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_2_16_state.msgSpecs[i].send, N_n_2_16_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_2_25_rcvs_1(N_n_2_16_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_2_16", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_17_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_2_17_state.msgSpecs.splice(0, N_n_2_17_state.msgSpecs.length - 1)
                    N_n_2_17_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_2_17_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_2_17_state.msgSpecs.length; i++) {
                        if (N_n_2_17_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_2_17_state.msgSpecs[i].send, N_n_2_17_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_2_25_rcvs_1(N_n_2_17_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_2_17", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_18_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_2_18_state.msgSpecs.splice(0, N_n_2_18_state.msgSpecs.length - 1)
                    N_n_2_18_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_2_18_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_2_18_state.msgSpecs.length; i++) {
                        if (N_n_2_18_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_2_18_state.msgSpecs[i].send, N_n_2_18_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_2_25_rcvs_1(N_n_2_18_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_2_18", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_19_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_2_19_state.msgSpecs.splice(0, N_n_2_19_state.msgSpecs.length - 1)
                    N_n_2_19_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_2_19_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_2_19_state.msgSpecs.length; i++) {
                        if (N_n_2_19_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_2_19_state.msgSpecs[i].send, N_n_2_19_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_2_25_rcvs_1(N_n_2_19_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_2_19", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_21_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_2_21_state.msgSpecs.splice(0, N_n_2_21_state.msgSpecs.length - 1)
                    N_n_2_21_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_2_21_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_2_21_state.msgSpecs.length; i++) {
                        if (N_n_2_21_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_2_21_state.msgSpecs[i].send, N_n_2_21_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_2_25_rcvs_1(N_n_2_21_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_2_21", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_22_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_2_22_state.msgSpecs.splice(0, N_n_2_22_state.msgSpecs.length - 1)
                    N_n_2_22_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_2_22_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_2_22_state.msgSpecs.length; i++) {
                        if (N_n_2_22_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_2_22_state.msgSpecs[i].send, N_n_2_22_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_2_25_rcvs_1(N_n_2_22_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_2_22", inlet "0", unsupported message : ' + G_msg_display(m))
                        }

function N_n_2_23_rcvs_0(m) {
                            
                if (
                    G_msg_isStringToken(m, 0) 
                    && G_msg_readStringToken(m, 0) === 'set'
                ) {
                    const outTemplate = []
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            outTemplate.push(G_msg_FLOAT_TOKEN)
                        } else {
                            outTemplate.push(G_msg_STRING_TOKEN)
                            outTemplate.push(G_msg_readStringToken(m, i).length)
                        }
                    }

                    const outMessage = G_msg_create(outTemplate)
                    for (let i = 1; i < G_msg_getLength(m); i++) {
                        if (G_msg_isFloatToken(m, i)) {
                            G_msg_writeFloatToken(
                                outMessage, i - 1, G_msg_readFloatToken(m, i)
                            )
                        } else {
                            G_msg_writeStringToken(
                                outMessage, i - 1, G_msg_readStringToken(m, i)
                            )
                        }
                    }

                    N_n_2_23_state.msgSpecs.splice(0, N_n_2_23_state.msgSpecs.length - 1)
                    N_n_2_23_state.msgSpecs[0] = {
                        transferFunction: function (m) {
                            return N_n_2_23_state.msgSpecs[0].outMessage
                        },
                        outTemplate: outTemplate,
                        outMessage: outMessage,
                        send: "",
                        hasSend: false,
                    }
                    return
    
                } else {
                    for (let i = 0; i < N_n_2_23_state.msgSpecs.length; i++) {
                        if (N_n_2_23_state.msgSpecs[i].hasSend) {
                            G_msgBuses_publish(N_n_2_23_state.msgSpecs[i].send, N_n_2_23_state.msgSpecs[i].transferFunction(m))
                        } else {
                            N_n_2_25_rcvs_1(N_n_2_23_state.msgSpecs[i].transferFunction(m))
                        }
                    }
                    return
                }
            
                            throw new Error('Node "n_2_23", inlet "0", unsupported message : ' + G_msg_display(m))
                        }






let N_n_1_15_outs_0 = 0

let N_n_1_5_outs_0 = 0





let N_n_1_10_outs_0 = 0



let N_n_1_11_outs_0 = 0

let N_n_1_28_outs_0 = 0

let N_n_1_26_outs_0 = 0

function N_n_0_3_snds_0(m) {
                        N_n_1_0_rcvs_0(m)
N_n_ioSnd_n_0_3_0_rcvs_0(m)
                    }
function N_m_n_1_5_0__routemsg_snds_0(m) {
                        N_m_n_1_5_0_sig_rcvs_0(m)
COLD_1(m)
                    }
function N_n_0_4_snds_0(m) {
                        N_n_1_3_rcvs_0(m)
N_n_ioSnd_n_0_4_0_rcvs_0(m)
                    }
function N_n_1_3_snds_0(m) {
                        N_m_n_1_2_1__routemsg_rcvs_0(m)
N_n_1_4_rcvs_0(m)
                    }
function N_n_1_19_snds_0(m) {
                        N_m_n_1_18_1__routemsg_rcvs_0(m)
N_n_1_20_rcvs_0(m)
                    }
function N_n_2_13_snds_0(m) {
                        N_n_2_8_rcvs_0(m)
N_n_2_25_rcvs_0(m)
N_n_2_28_rcvs_0(m)
                    }
function N_n_2_8_snds_0(m) {
                        N_n_2_9_rcvs_0(m)
N_n_2_14_rcvs_0(m)
                    }
function N_n_2_29_snds_0(m) {
                        N_n_1_14_rcvs_0(m)
N_m_n_1_15_0__routemsg_rcvs_0(m)
N_n_2_30_rcvs_0(m)
                    }
function N_m_n_1_15_0__routemsg_snds_0(m) {
                        N_m_n_1_15_0_sig_rcvs_0(m)
COLD_0(m)
                    }

        function COLD_0(m) {
                    N_m_n_1_15_0_sig_outs_0 = N_m_n_1_15_0_sig_state.currentValue
                    NT_osc_t_setStep(N_n_1_15_state, N_m_n_1_15_0_sig_outs_0)
                }
function COLD_1(m) {
                    N_m_n_1_5_0_sig_outs_0 = N_m_n_1_5_0_sig_state.currentValue
                    NT_osc_t_setStep(N_n_1_5_state, N_m_n_1_5_0_sig_outs_0)
                }
        function IO_rcv_n_0_3_0(m) {
                    N_n_0_3_rcvs_0(m)
                }
function IO_rcv_n_0_4_0(m) {
                    N_n_0_4_rcvs_0(m)
                }
        const IO_snd_n_0_3_0 = (m) => {exports.io.messageSenders['n_0_3']['0'](m)}
const IO_snd_n_0_4_0 = (m) => {exports.io.messageSenders['n_0_4']['0'](m)}

        const exports = {
            metadata: {"libVersion":"0.1.0","customMetadata":{"pdNodes":{"0":{"3":{"id":"3","type":"vsl","args":[0,127,0,0,"",""],"nodeClass":"control","layout":{"x":354,"y":84,"width":17,"height":128,"log":0,"label":"","labelX":0,"labelY":-9,"labelFont":"0","labelFontSize":10,"bgColor":"#e4e4e4","fgColor":"#4d4d4d","labelColor":"#373737","steadyOnClick":"1"}},"4":{"id":"4","type":"vsl","args":[0,127,0,0,"",""],"nodeClass":"control","layout":{"x":388,"y":84,"width":17,"height":128,"log":0,"label":"","labelX":0,"labelY":-9,"labelFont":"0","labelFontSize":10,"bgColor":"#e4e4e4","fgColor":"#4d4d4d","labelColor":"#373737","steadyOnClick":"1"}}}},"graph":{"n_0_3":{"id":"n_0_3","type":"vsl","args":{"minValue":0,"maxValue":127,"sendBusName":"empty","receiveBusName":"empty","initValue":0,"outputOnLoad":false},"sources":{"0":[{"nodeId":"n_ioRcv_n_0_3_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_1_0","portletId":"0"},{"nodeId":"n_ioSnd_n_0_3_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}},"isPushingMessages":true},"n_0_4":{"id":"n_0_4","type":"vsl","args":{"minValue":0,"maxValue":127,"sendBusName":"empty","receiveBusName":"empty","initValue":0,"outputOnLoad":false},"sources":{"0":[{"nodeId":"n_ioRcv_n_0_4_0","portletId":"0"}]},"sinks":{"0":[{"nodeId":"n_1_3","portletId":"0"},{"nodeId":"n_ioSnd_n_0_4_0","portletId":"0"}]},"inlets":{"0":{"type":"message","id":"0"}},"outlets":{"0":{"type":"message","id":"0"}},"isPushingMessages":true}},"pdGui":[{"nodeClass":"control","patchId":"0","pdNodeId":"3","nodeId":"n_0_3"},{"nodeClass":"control","patchId":"0","pdNodeId":"4","nodeId":"n_0_4"}]},"settings":{"audio":{"channelCount":{"in":2,"out":2},"bitDepth":64,"sampleRate":0,"blockSize":0},"io":{"messageReceivers":{"n_0_3":["0"],"n_0_4":["0"]},"messageSenders":{"n_0_3":["0"],"n_0_4":["0"]}}},"compilation":{"variableNamesIndex":{"io":{"messageReceivers":{"n_0_3":{"0":"IO_rcv_n_0_3_0"},"n_0_4":{"0":"IO_rcv_n_0_4_0"}},"messageSenders":{"n_0_3":{"0":"IO_snd_n_0_3_0"},"n_0_4":{"0":"IO_snd_n_0_4_0"}}},"globals":{"commons":{"getArray":"G_commons_getArray","setArray":"G_commons_setArray"}}}}},
            initialize: (sampleRate, blockSize) => {
                exports.metadata.settings.audio.sampleRate = sampleRate
                exports.metadata.settings.audio.blockSize = blockSize
                SAMPLE_RATE = sampleRate
                BLOCK_SIZE = blockSize

                
                N_n_0_3_state.messageSender = N_n_0_3_snds_0
                N_n_0_3_state.messageReceiver = function (m) {
                    NT_vsl_receiveMessage(N_n_0_3_state, m)
                }
                NT_vsl_setReceiveBusName(N_n_0_3_state, "empty")
    
                
            

                N_n_1_0_state.messageSender = N_m_n_1_5_0__routemsg_rcvs_0
                N_n_1_0_state.messageReceiver = function (m) {
                    NT_vsl_receiveMessage(N_n_1_0_state, m)
                }
                NT_vsl_setReceiveBusName(N_n_1_0_state, "empty")
    
                
            




                N_n_0_4_state.messageSender = N_n_0_4_snds_0
                N_n_0_4_state.messageReceiver = function (m) {
                    NT_vsl_receiveMessage(N_n_0_4_state, m)
                }
                NT_vsl_setReceiveBusName(N_n_0_4_state, "empty")
    
                
            

                N_n_1_3_state.messageSender = N_n_1_3_snds_0
                N_n_1_3_state.messageReceiver = function (m) {
                    NT_vsl_receiveMessage(N_n_1_3_state, m)
                }
                NT_vsl_setReceiveBusName(N_n_1_3_state, "empty")
    
                
            



            N_n_1_4_state.messageReceiver = function (m) {
                NT_floatatom_receiveMessage(N_n_1_4_state, m)
            }
            N_n_1_4_state.messageSender = G_msg_VOID_MESSAGE_RECEIVER
            NT_floatatom_setReceiveBusName(N_n_1_4_state, "empty")
        


            N_n_1_12_state.messageReceiver = function (m) {
                NT_floatatom_receiveMessage(N_n_1_12_state, m)
            }
            N_n_1_12_state.messageSender = G_msg_VOID_MESSAGE_RECEIVER
            NT_floatatom_setReceiveBusName(N_n_1_12_state, "empty")
        

                N_n_1_16_state.messageSender = N_m_n_1_21_0__routemsg_rcvs_0
                N_n_1_16_state.messageReceiver = function (m) {
                    NT_vsl_receiveMessage(N_n_1_16_state, m)
                }
                NT_vsl_setReceiveBusName(N_n_1_16_state, "empty")
    
                
            



                N_n_1_19_state.messageSender = N_n_1_19_snds_0
                N_n_1_19_state.messageReceiver = function (m) {
                    NT_vsl_receiveMessage(N_n_1_19_state, m)
                }
                NT_vsl_setReceiveBusName(N_n_1_19_state, "empty")
    
                
            



            N_n_1_20_state.messageReceiver = function (m) {
                NT_floatatom_receiveMessage(N_n_1_20_state, m)
            }
            N_n_1_20_state.messageSender = G_msg_VOID_MESSAGE_RECEIVER
            NT_floatatom_setReceiveBusName(N_n_1_20_state, "empty")
        

            N_n_1_27_state.messageReceiver = function (m) {
                NT_floatatom_receiveMessage(N_n_1_27_state, m)
            }
            N_n_1_27_state.messageSender = G_msg_VOID_MESSAGE_RECEIVER
            NT_floatatom_setReceiveBusName(N_n_1_27_state, "empty")
        

                N_n_2_9_state.messageSender = G_msg_VOID_MESSAGE_RECEIVER
                N_n_2_9_state.messageReceiver = function (m) {
                    NT_nbx_receiveMessage(N_n_2_9_state, m)
                }
                NT_nbx_setReceiveBusName(N_n_2_9_state, "empty")
    
                
            
G_commons_waitFrame(0, () => N_n_2_12_rcvs_0(G_bangUtils_bang()))

            N_n_2_12_state.snd0 = N_n_2_32_rcvs_0
            N_n_2_12_state.sampleRatio = computeUnitInSamples(SAMPLE_RATE, 1, "msec")
            NT_metro_setRate(N_n_2_12_state, 130)
            N_n_2_12_state.tickCallback = function () {
                NT_metro_scheduleNextTick(N_n_2_12_state)
            }
        

        N_n_2_32_state.messageReceiver = function (m) {
            NT_bang_receiveMessage(N_n_2_32_state, m)
        }
        N_n_2_32_state.messageSender = N_n_2_33_rcvs_0
        NT_bang_setReceiveBusName(N_n_2_32_state, "empty")

        
    

            NT_float_setValue(N_n_2_33_state, 0)
        

            NT_add_setLeft(N_n_2_34_state, 0)
            NT_add_setRight(N_n_2_34_state, 1)
        

            NT_mod_setLeft(N_n_2_37_state, 0)
            NT_mod_setRight(N_n_2_37_state, 65)
        


            N_n_2_36_state.messageReceiver = function (m) {
                NT_floatatom_receiveMessage(N_n_2_36_state, m)
            }
            N_n_2_36_state.messageSender = N_n_2_15_rcvs_0
            NT_floatatom_setReceiveBusName(N_n_2_36_state, "empty")
        


        N_n_2_13_state.messageReceiver = function (m) {
            NT_bang_receiveMessage(N_n_2_13_state, m)
        }
        N_n_2_13_state.messageSender = N_n_2_13_snds_0
        NT_bang_setReceiveBusName(N_n_2_13_state, "empty")

        
    



            N_n_2_0_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_2_0_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_2_0_state.msgSpecs[0].outTemplate = []

                N_n_2_0_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_2_0_state.msgSpecs[0].outMessage = G_msg_create(N_n_2_0_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_2_0_state.msgSpecs[0].outMessage, 0, 46)
            
        

            NT_add_setLeft(N_n_2_25_state, 0)
            NT_add_setRight(N_n_2_25_state, 0)
        

            N_n_2_27_state.messageReceiver = function (m) {
                NT_floatatom_receiveMessage(N_n_2_27_state, m)
            }
            N_n_2_27_state.messageSender = N_n_2_29_rcvs_0
            NT_floatatom_setReceiveBusName(N_n_2_27_state, "empty")
        


            N_n_1_14_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_1_14_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },

                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_1_14_state.msgSpecs[1].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_1_14_state.msgSpecs[0].outTemplate = []

                N_n_1_14_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_1_14_state.msgSpecs[0].outMessage = G_msg_create(N_n_1_14_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_1_14_state.msgSpecs[0].outMessage, 0, 0)
            

        
        
        
    
N_n_1_14_state.msgSpecs[1].outTemplate = []

                N_n_1_14_state.msgSpecs[1].outTemplate.push(G_msg_FLOAT_TOKEN)
            

                N_n_1_14_state.msgSpecs[1].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_1_14_state.msgSpecs[1].outMessage = G_msg_create(N_n_1_14_state.msgSpecs[1].outTemplate)

                G_msg_writeFloatToken(N_n_1_14_state.msgSpecs[1].outMessage, 0, 1)
            

                G_msg_writeFloatToken(N_n_1_14_state.msgSpecs[1].outMessage, 1, 10000)
            
        




                N_n_2_30_state.messageSender = G_msg_VOID_MESSAGE_RECEIVER
                N_n_2_30_state.messageReceiver = function (m) {
                    NT_nbx_receiveMessage(N_n_2_30_state, m)
                }
                NT_nbx_setReceiveBusName(N_n_2_30_state, "empty")
    
                
            

            N_n_2_1_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_2_1_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_2_1_state.msgSpecs[0].outTemplate = []

                N_n_2_1_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_2_1_state.msgSpecs[0].outMessage = G_msg_create(N_n_2_1_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_2_1_state.msgSpecs[0].outMessage, 0, 48)
            
        

            N_n_2_2_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_2_2_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_2_2_state.msgSpecs[0].outTemplate = []

                N_n_2_2_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_2_2_state.msgSpecs[0].outMessage = G_msg_create(N_n_2_2_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_2_2_state.msgSpecs[0].outMessage, 0, 49)
            
        

            N_n_2_3_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_2_3_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_2_3_state.msgSpecs[0].outTemplate = []

                N_n_2_3_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_2_3_state.msgSpecs[0].outMessage = G_msg_create(N_n_2_3_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_2_3_state.msgSpecs[0].outMessage, 0, 51)
            
        

            N_n_2_4_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_2_4_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_2_4_state.msgSpecs[0].outTemplate = []

                N_n_2_4_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_2_4_state.msgSpecs[0].outMessage = G_msg_create(N_n_2_4_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_2_4_state.msgSpecs[0].outMessage, 0, 52)
            
        

            N_n_2_5_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_2_5_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_2_5_state.msgSpecs[0].outTemplate = []

                N_n_2_5_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_2_5_state.msgSpecs[0].outMessage = G_msg_create(N_n_2_5_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_2_5_state.msgSpecs[0].outMessage, 0, 54)
            
        

            N_n_2_6_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_2_6_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_2_6_state.msgSpecs[0].outTemplate = []

                N_n_2_6_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_2_6_state.msgSpecs[0].outMessage = G_msg_create(N_n_2_6_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_2_6_state.msgSpecs[0].outMessage, 0, 56)
            
        

            N_n_2_7_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_2_7_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_2_7_state.msgSpecs[0].outTemplate = []

                N_n_2_7_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_2_7_state.msgSpecs[0].outMessage = G_msg_create(N_n_2_7_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_2_7_state.msgSpecs[0].outMessage, 0, 58)
            
        



            N_n_2_16_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_2_16_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_2_16_state.msgSpecs[0].outTemplate = []

                N_n_2_16_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_2_16_state.msgSpecs[0].outMessage = G_msg_create(N_n_2_16_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_2_16_state.msgSpecs[0].outMessage, 0, 0)
            
        

            N_n_2_17_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_2_17_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_2_17_state.msgSpecs[0].outTemplate = []

                N_n_2_17_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_2_17_state.msgSpecs[0].outMessage = G_msg_create(N_n_2_17_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_2_17_state.msgSpecs[0].outMessage, 0, 12)
            
        

            N_n_2_18_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_2_18_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_2_18_state.msgSpecs[0].outTemplate = []

                N_n_2_18_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_2_18_state.msgSpecs[0].outMessage = G_msg_create(N_n_2_18_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_2_18_state.msgSpecs[0].outMessage, 0, 24)
            
        

            N_n_2_19_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_2_19_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_2_19_state.msgSpecs[0].outTemplate = []

                N_n_2_19_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_2_19_state.msgSpecs[0].outMessage = G_msg_create(N_n_2_19_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_2_19_state.msgSpecs[0].outMessage, 0, 48)
            
        

            N_n_2_21_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_2_21_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_2_21_state.msgSpecs[0].outTemplate = []

                N_n_2_21_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_2_21_state.msgSpecs[0].outMessage = G_msg_create(N_n_2_21_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_2_21_state.msgSpecs[0].outMessage, 0, -12)
            
        

            N_n_2_22_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_2_22_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_2_22_state.msgSpecs[0].outTemplate = []

                N_n_2_22_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_2_22_state.msgSpecs[0].outMessage = G_msg_create(N_n_2_22_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_2_22_state.msgSpecs[0].outMessage, 0, -24)
            
        

            N_n_2_23_state.msgSpecs = [
                
                    {
                        transferFunction: function (inMessage) {
                            
                            return N_n_2_23_state.msgSpecs[0].outMessage
                        },
                        outTemplate: [],
                        outMessage: G_msg_EMPTY_MESSAGE,
                        send: "",
                        hasSend: false,
                    },
            ]

            
        
        
        
    
N_n_2_23_state.msgSpecs[0].outTemplate = []

                N_n_2_23_state.msgSpecs[0].outTemplate.push(G_msg_FLOAT_TOKEN)
            
N_n_2_23_state.msgSpecs[0].outMessage = G_msg_create(N_n_2_23_state.msgSpecs[0].outTemplate)

                G_msg_writeFloatToken(N_n_2_23_state.msgSpecs[0].outMessage, 0, -48)
            
        

        N_n_2_11_state.messageReceiver = function (m) {
            NT_bang_receiveMessage(N_n_2_11_state, m)
        }
        N_n_2_11_state.messageSender = N_n_2_12_rcvs_0
        NT_bang_setReceiveBusName(N_n_2_11_state, "empty")

        
    



            NT_osc_t_setStep(N_n_1_15_state, 0)
        

            NT_osc_t_setStep(N_n_1_5_state, 0)
        







                COLD_0(G_msg_EMPTY_MESSAGE)
COLD_1(G_msg_EMPTY_MESSAGE)
            },
            dspLoop: (INPUT, OUTPUT) => {
                
        for (IT_FRAME = 0; IT_FRAME < BLOCK_SIZE; IT_FRAME++) {
            G_commons__emitFrame(FRAME)
            
                N_n_1_15_outs_0 = Math.cos(N_n_1_15_state.phase)
                N_n_1_15_state.phase += N_n_1_15_state.step
            

                N_n_1_5_outs_0 = Math.cos(N_n_1_5_state.phase)
                N_n_1_5_state.phase += N_n_1_5_state.step
            

        N_n_1_13_outs_0 = N_n_1_13_state.currentValue
        if (toFloat(FRAME) < N_n_1_13_state.currentLine.p1.x) {
            N_n_1_13_state.currentValue += N_n_1_13_state.currentLine.dy
            if (toFloat(FRAME + 1) >= N_n_1_13_state.currentLine.p1.x) {
                N_n_1_13_state.currentValue = N_n_1_13_state.currentLine.p1.y
            }
        }
    
N_n_1_10_outs_0 = (N_n_1_15_outs_0 + (N_n_1_5_outs_0 * (N_m_n_1_2_1_sig_state.currentValue))) * N_n_1_13_outs_0
OUTPUT[0][IT_FRAME] = N_n_1_10_outs_0
OUTPUT[1][IT_FRAME] = N_n_1_10_outs_0

        N_n_1_11_state.currentValue = N_n_1_13_outs_0
    

        N_n_1_28_outs_0 = N_n_1_28_state.currentValue
        if (toFloat(FRAME) < N_n_1_28_state.currentLine.p1.x) {
            N_n_1_28_state.currentValue += N_n_1_28_state.currentLine.dy
            if (toFloat(FRAME + 1) >= N_n_1_28_state.currentLine.p1.x) {
                N_n_1_28_state.currentValue = N_n_1_28_state.currentLine.p1.y
            }
        }
    

        N_n_1_26_state.currentValue = N_n_1_28_outs_0
    
            FRAME++
        }
    
            },
            io: {
                messageReceivers: {
                    n_0_3: {
                            "0": IO_rcv_n_0_3_0,
                        },
n_0_4: {
                            "0": IO_rcv_n_0_4_0,
                        },
                },
                messageSenders: {
                    n_0_3: {
                            "0": () => undefined,
                        },
n_0_4: {
                            "0": () => undefined,
                        },
                },
            }
        }

        
exports.G_commons_getArray = G_commons_getArray
exports.G_commons_setArray = G_commons_setArray
    