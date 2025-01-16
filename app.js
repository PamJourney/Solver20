document.getElementById('solver-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const num1 = parseInt(document.getElementById('num1').value);
    const num2 = parseInt(document.getElementById('num2').value);
    const num3 = parseInt(document.getElementById('num3').value);
    const num4 = parseInt(document.getElementById('num4').value);

    const nums = [num1, num2, num3, num4];
    const target = 20;
    const operators = ['+', '-', '*', '/'];
    const solutions = [];

    // Fungsi untuk menghasilkan semua permutasi
    function permute(arr) {
        const results = [];

        function backtrack(current, remaining) {
            if (remaining.length === 0) {
                results.push(current);
                return;
            }
            for (let i = 0; i < remaining.length; i++) {
                backtrack(current.concat(remaining[i]), remaining.slice(0, i).concat(remaining.slice(i + 1)));
            }
        }

        backtrack([], arr);
        return results;
    }

    // Fungsi untuk mengevaluasi ekspresi
    function evaluateExpression(nums, ops, arrangement) {
        let a = nums[0], b = nums[1], c = nums[2], d = nums[3];
        let result;
        let expr = '';

        try {
            switch(arrangement) {
                case 1: // ((a op1 b) op2 c) op3 d
                    result = compute(compute(compute(a, ops[0], b), ops[1], c), ops[2], d);
                    expr = `(${a} ${ops[0]} ${b}) ${ops[1]} ${c} ${ops[2]} ${d} = ${result}`;
                    break;
                case 2: // (a op1 (b op2 c)) op3 d
                    result = compute(compute(a, ops[0], compute(b, ops[1], c)), ops[2], d);
                    expr = `${a} ${ops[0]} (${b} ${ops[1]} ${c}) ${ops[2]} ${d} = ${result}`;
                    break;
                case 3: // a op1 ((b op2 c) op3 d)
                    result = compute(a, ops[0], compute(compute(b, ops[1], c), ops[2], d));
                    expr = `${a} ${ops[0]} (${b} ${ops[1]} ${c}) ${ops[2]} ${d} = ${result}`;
                    break;
                case 4: // a op1 (b op2 (c op3 d))
                    result = compute(a, ops[0], compute(b, ops[1], compute(c, ops[2], d)));
                    expr = `${a} ${ops[0]} (${b} ${ops[1]} ${c} ${ops[2]} ${d}) = ${result}`;
                    break;
                case 5: // (a op1 b) op2 (c op3 d)
                    result = compute(compute(a, ops[0], b), ops[1], compute(c, ops[2], d));
                    expr = `(${a} ${ops[0]} ${b}) ${ops[1]} (${c} ${ops[2]} ${d}) = ${result}`;
                    break;
                default:
                    return null;
            }
            if (Math.abs(result - target) < 1e-6) {
                return expr;
            }
        } catch (error) {
            // Menghindari error seperti pembagian dengan nol
            return null;
        }
        return null;
    }

    // Fungsi untuk menghitung operasi
    function compute(a, op, b) {
        switch(op) {
            case '+': return a + b;
            case '-': return a - b;
            case '*': return a * b;
            case '/': 
                if (b === 0) throw 'Division by zero';
                return a / b;
            default: return 0;
        }
    }

    const permutations = permute(nums);
    const operatorCombos = [];

    // Mengenerate semua kombinasi operator
    for (let op1 of operators) {
        for (let op2 of operators) {
            for (let op3 of operators) {
                operatorCombos.push([op1, op2, op3]);
            }
        }
    }

    // Mengenerate semua penempatan tanda kurung (1-5)
    const arrangements = [1,2,3,4,5];

    // Iterasi melalui semua kombinasi
    for (let perm of permutations) {
        for (let ops of operatorCombos) {
            for (let arrangement of arrangements) {
                const expr = evaluateExpression(perm, ops, arrangement);
                if (expr && !solutions.includes(expr)) {
                    // Ganti '*' dengan 'x' untuk tampilan
                    solutions.push(expr.replace(/\*/g, 'x'));
                }
            }
        }
    }

    // Menampilkan hasil
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (solutions.length === 0) {
        resultsDiv.innerHTML = `<p>Tidak ada solusi yang ditemukan.</p>`;
    } else {
        solutions.forEach((sol, index) => {
            resultsDiv.innerHTML += `<p>Solusi ke-${index + 1}: ${sol}</p>`;
        });
        resultsDiv.innerHTML += `<p>Total Solusi: ${solutions.length} buah.</p>`;
    }
});