function createShader(gl, type, source){
    // 根据 type 创建着色器
    const shader = gl.createShader(type);
    // 绑定内容文本 source
    gl.shaderSource(shader, source);
    // 编译着色器（将文本内容转换成着色器）
    gl.compileShader(shader);
    // 获取编译后的状态
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }

    // 获取当前着色器相关信息
    console.log(gl.getShaderInfoLog(shader));
    // 删除失败的着色器
    gl.deleteShader(shader);
}

// 创建着色程序 program。gl：WebGL 上下文；vertexShader：顶点着色器对象；fragmentShader：片元着色器对象
function createProgram(gl, vertexShader, fragmentShader){
    // 创建着色程序
    const program = gl.createProgram();
    // 让着色程序获取到顶点着色器
    gl.attachShader(program, vertexShader);
    // 让着色程序获取到片元着色器
    gl.attachShader(program, fragmentShader);
    // 将两个着色器与着色程序进行绑定
    gl.linkProgram(program);
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }

    console.log(gl.getProgramInfoLog(program));
    // 绑定失败则删除着色程序
    gl.deleteProgram(program);
}

function main(){
    const canvas = document.createElement('canvas');
    document.getElementsByTagName('body')[0].appendChild(canvas);
    canvas.width = 400;
    canvas.height = 300;
    // 获取 WebGL 上下文（Context），后续统称 gl。
    const gl = canvas.getContext('webgl');
    if (!gl) {
        console.log('There is no gl object');
        return;
    }

    const vertexSource = `
    attribute vec2 a_position;

    void main(){
        gl_Position = vec4(a_position, 0.0, 1.0);
    }
    `;
    // 根据着色器文本内容，创建 WebGL 上可以使用的着色器对象
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);

    const positions = [
        0, 0,
        0.7, 0,
        0, 0.5,
    ];

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // 通过 bufferData 将当前顶点数据存入缓冲（vertexBuffer）中
    // gl 内部有很多默认状态，所以此时需要明确储存的顶点缓冲是我自己定义的缓冲。在 GPU 中数据存储需要很谨慎，不然就有可能造成内存浪费。
    // 接着，需要明确数据大小，这里顶点坐标的每一个分量都采用 32 位浮点型数据存储。需要合理的为每一类型数据分配内存。
    // 最后一个参数 gl.STATIC_DRAW 是提示 WebGL 我们将怎么使用这些数据。因为此处我们将顶点数据写死了，所以采用 gl.STATIC_DRAW。
    // gl.STATIC_DRAW ：数据不会或几乎不会改变。
    // gl.DYNAMIC_DRAW：数据会被改变很多。
    // gl.STREAM_DRAW ：数据每次绘制时都会改变
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    const fragmentSource = `
    precision mediump float;

    void main (){
        // 将三角形输出的最终颜色固定为玫红色
        // 这里的四个分量分别代表红（r）、绿（g）、蓝（b）和透明度（alpha）
        // 颜色数值取归一化值。最终绘制的其实就是 [255, 0, 127. 255]
        gl_FragColor = vec4(1, 0, 0.5, 1);
    }
    `;

    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
    const program = createProgram(gl, vertexShader, fragmentShader);

    // 设置视口尺寸，将视口和画布尺寸同步
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    // 清除画布颜色，将它设置成透明色
    // 注意，渲染管线是每帧都会绘制内容，就好比每帧都在画板上画画，如果不清除的话，就有可能出现花屏现象
    gl.clearColor(0, 0, 0, 1);
    // 通过此方法清除的颜色缓冲，所有颜色值为 clearColor 设置的颜色值
    // 通过此方法清除的模板缓冲，所有模板值为 0
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.useProgram(program);

    const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);
    // positionAttributeLocation：顶点着色器上的 “a_position” 属性
    // size：当前一个顶点数据里要取的数据长度，因为绘制的是平面三角形，所以位置只需提供 x，y 即可，所以数量是 2
    // type：数据缓冲类型，此处顶点采用的是 float 32，因此使用 gl.FLOAT
    // normalize：数据是否是归一化的数据，通常不用
    // stride：主要表达数据存储的方式，单位是字节。0 表示属性数据是连续存放的，通常在只有一个属性的数据里这么用
    // 非 0 则表示同一个属性在数据中的间隔大小，可以理解为步长。这个会在后面的说明中体现
    // offset：属性在缓冲区中每间隔的偏移值，单位是字节
    // gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    // gl.drawArrays(primitiveType, offset, count);
    // primitiveType：指定图元绘制形式，常见的为绘制点（gl.POINTS），线（gl.LINE_STRIP）和三角面（gl.TRIANGLES）。此处绘制三角形。
    // offset：从哪个点开始绘制
    // count：本次绘制会使用到多少个点。也代表顶点着色器需要运行几次。顶点着色器每次只处理一个顶点。
    gl.drawArrays(gl.TRIANGLES, 0, 3);


}

main();