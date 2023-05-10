var asigBasMin = 5785839;
var gastRepreMin = 10285919;
var salarioBaseGen = 0;
var subAlimentacion = 68658;
var subAlimentacionRetro = 0;
var bonifSeguro = 17311;
var auxMutuo = 5000;
var subFamNE = 37866;
var primaExp = 0;
var primaPer = 0;
var primaPerRetro = 0;
var otrosDescuentos = 0;
var otrosDescuentosRetro = 0;
var otrosDevengos = 0;
var otrosDevengosRetro = 0;
var devengado = 0;
var descuentos = 0;
var total = 0;
var sanidad = 0;
var casur = 0;
var cajaHonor = 0;
let asigBasic = 0;
let primaOP = 0;
let primaNE = 0;
let SubFam = 0;
let titleSubFam = "";
let titlePrimaNE = "";
let distincion = 0;
let aumento = 0;
let mes = 4;
let nivel = false;
let nivelOf = ["ST", "TE", "CT", "MY", "TC", "CR"];
let gradNiv = "";

$("#btnCalcular").click(() => {

    gradNiv = $("#selecGrado").val();
    gradNiv = $(`#selecGrado option[value='${gradNiv}']`)[0].innerText;

    if (nivelOf.find((item) => item == gradNiv))
        nivel = true;
    else
        nivel = false;

    aumento = $("#aumento").val();
    var coma = [...aumento].filter(x => x === ',').length;
    var punto = [...aumento].filter(x => x === '.').length;
    var espacio = [...aumento].filter(x => x === ' ').length;

    if (coma > 0 || punto > 1 || espacio > 0) {
        Swal.fire({
            icon: 'error',
            title: '¡Error en porcentaje!',
            text: 'Para separar decimales solo debe utilizar un punto "." y sin espacios',
        })
        return false;
    }

    salarioBaseGen = parseFloat((asigBasMin + gastRepreMin) * 0.45);

    salarioBaseGen += (salarioBaseGen * $("#aumento").val() / 100);

    asigBasic = salarioBaseGen * parseFloat($("#selecGrado").val()) / 100;
    SubFam = 0;
    subFamNE = SumAumento(subFamNE);
    subAlimentacion = 68658;
    subAlimentacion = SumAumento(subAlimentacion);
    bonifSeguro = 17311;
    bonifSeguro = SumAumento(bonifSeguro);

    distincion = 0;
    sanidad = asigBasic * 4 / 100;
    casur = asigBasic * 6 / 100;
    cajaHonor = asigBasic * $("#selecCajaHonor").val() / 100;

    if (nivel) {
        primaOP = asigBasic * $("#selecOrdPub_OF").val() / 100;
        primaNE = asigBasic * 0.495;
        titlePrimaNE = "Prima de actividad";
    } else {
        primaOP = asigBasic * $("#selecOrdPub").val() / 100;
        primaNE = asigBasic * 0.20;
        titlePrimaNE = "Prima nivel ejecutivo";
    }

    primaExp = CalculoExp(asigBasic);
    primaOPRetro = (primaOP - ElimAumento(primaOP)) * mes;
    primaNERetro = (primaNE - ElimAumento(primaNE)) * mes;

    asigBasicRetro = (asigBasic - ElimAumento(asigBasic)) * mes;
    SubFamRetro = 0;
    subFamNERetro = (SumAumento(subFamNE) - subFamNE) * mes;
    subAlimentacionRetro = (subAlimentacion - ElimAumento(subAlimentacion)) * mes;
    bonifSeguroRetro = (bonifSeguro - ElimAumento(bonifSeguro)) * mes;
    primaExpRetro = (primaExp - ElimAumento(primaExp)) * mes;
    distincionRetro = 0;
    sanidadRetro = (sanidad - ElimAumento(sanidad)) * mes;
    casurRetro = (casur - ElimAumento(casur)) * mes;
    cajaHonorRetro = (cajaHonor - ElimAumento(cajaHonor)) * mes;

    if ($("#selecAsisFam").val() != 0 && $("#selecSubFam").val() != 0) {
        Swal.fire({
            icon: 'error',
            title: '¡Opciones incompatibles!',
            text: 'Solo puede seleccionar una opción entre "Bonificación de asistencia familiar" y "Subsidio familiar"',
        })
        return false;
    }
    else if ($("#selecAsisFam").val() != 0) {
        SubFam = asigBasic * $("#selecAsisFam").val() / 100;
        SubFamRetro = ((SubFam - ElimAumento(SubFam)) * mes) / 2;

        titleSubFam = "Bonificación Asistencia familiar";
        titleSubFamRetro = "Bonificación Asistencia familiar";
    }
    else if ($("#selecSubFam").val() != 0) {

        SubFam = subFamNE * $("#selecSubFam").val();
        SubFamRetro = (SubFam - ElimAumento(SubFam)) * mes;

        titleSubFam = "Subsidio familiar NE";
        titleSubFamRetro = "Subsidio familiar NE";

    }
    else if ($("#selecSubFam_OF").val() != 0) {

        SubFam = asigBasic * $("#selecSubFam_OF").val() / 100;
        SubFamRetro = (SubFam - ElimAumento(SubFam)) * mes;

        titleSubFam = "Subsidio familiar";
        titleSubFamRetro = "Subsidio familiar";
    }

    $("#tablaDevengos tbody").empty();
    $("#tablaDescuentos tbody").empty();

    $("#tablaDevengosComp tbody").empty();
    $("#tablaDescuentosComp tbody").empty();

    $("#tablaDevengosRetro tbody").empty();
    $("#tablaDescuentosRetro tbody").empty();

    $("#tablaDevengos tbody").append(
        `<tr><td>Asignación básica</td><td style="text-align: right; white-space: nowrap;" id="asigBasic">${ConvertirEnString(asigBasic)}</td></tr>
         <tr><td>Subsidio alimentación</td><td style="text-align: right; white-space: nowrap;" id="subAlim">${ConvertirEnString(subAlimentacion)}</td></tr>
         <tr><td>Bonificación seguro de vida</td><td style="text-align: right; white-space: nowrap;" id="bonSegVida">${ConvertirEnString(bonifSeguro)}</td></tr>
         <tr><td>${titlePrimaNE}</td><td style="text-align: right; white-space: nowrap;" id="primaNE">${ConvertirEnString(primaNE)}</td></tr>`
    );

    $("#tablaDevengosComp tbody").append(
        `<tr>
            <td>Asignación básica</td>
            <td style="text-align: right; white-space: nowrap;" id="asigBasic">${ConvertirEnString(ElimAumento(asigBasic))}</td>
            <td style="text-align: right; white-space: nowrap;" id="asigBasic">${ConvertirEnString(asigBasic)}</td>
            <td style="text-align: right; white-space: nowrap;" id="asigBasic">${ConvertirEnString(asigBasic - ElimAumento(asigBasic))}</td>
        </tr>
        <tr>
            <td>Subsidio alimentación</td>
            <td style="text-align: right; white-space: nowrap;" id="subAlim">${ConvertirEnString(ElimAumento(subAlimentacion))}</td>
            <td style="text-align: right; white-space: nowrap;" id="subAlim">${ConvertirEnString(subAlimentacion)}</td>
            <td style="text-align: right; white-space: nowrap;" id="subAlim">${ConvertirEnString(subAlimentacion - ElimAumento(subAlimentacion))}</td>
        </tr>
        <tr>
            <td>Bonificación seguro de vida</td>
            <td style="text-align: right; white-space: nowrap;" id="bonSegVida">${ConvertirEnString(ElimAumento(bonifSeguro))}</td>
            <td style="text-align: right; white-space: nowrap;" id="bonSegVida">${ConvertirEnString(bonifSeguro)}</td>
            <td style="text-align: right; white-space: nowrap;" id="bonSegVida">${ConvertirEnString(bonifSeguro - ElimAumento(bonifSeguro))}
            </td>
        </tr>
        <tr>
            <td>${titlePrimaNE}</td>
            <td style="text-align: right; white-space: nowrap;" id="primaNE">${ConvertirEnString(ElimAumento(primaNE))}</td>
            <td style="text-align: right; white-space: nowrap;" id="primaNE">${ConvertirEnString(primaNE)}</td>
            <td style="text-align: right; white-space: nowrap;" id="primaNE">${ConvertirEnString(primaNE - ElimAumento(primaNE))}</td>
        </tr>`
    );

    $("#tablaDevengosRetro tbody").append(
        `<tr><td>Asignación básica</td><td style="text-align: right; white-space: nowrap;" id="asigBasic">${ConvertirEnString(asigBasicRetro)}</td></tr>
         <tr><td>Subsidio alimentación</td><td style="text-align: right; white-space: nowrap;" id="subAlim">${ConvertirEnString(subAlimentacionRetro)}</td></tr>
         <tr><td>Bonificación seguro de vida </td><td style="text-align: right; white-space: nowrap;" id="bonSegVida">${ConvertirEnString(bonifSeguroRetro)}</td></tr>
         <tr><td>${titlePrimaNE}</td><td style="text-align: right; white-space: nowrap;" id="primaNE">${ConvertirEnString(primaNERetro)}</td></tr>`
    );

    if (primaOP > 0) {

        $("#tablaDevengos tbody").append(
            `<tr><td>Prima orden público</td><td style="text-align: right; white-space: nowrap;" id="primaExp">${ConvertirEnString(primaOP)}</td></tr>`
        );

        $("#tablaDevengosComp tbody").append(
            `<tr>
                <td>Prima orden público</td>
                <td style="text-align: right; white-space: nowrap;" id="primaExp">${ConvertirEnString(ElimAumento(primaOP))}</td>
                <td style="text-align: right; white-space: nowrap;" id="primaExp">${ConvertirEnString(primaOP)}</td>
                <td style="text-align: right; white-space: nowrap;" id="primaExp">${ConvertirEnString(primaOP - ElimAumento(primaOP))}</td>
            </tr>`
        );

        $("#tablaDevengosRetro tbody").append(
            `<tr><td>Prima orden público</td><td style="text-align: right; white-space: nowrap;" id="primaExp">${ConvertirEnString(primaOPRetro)}</td></tr>`
        );
    }

    if (primaExp > 0) {

        $("#tablaDevengos tbody").append(
            `<tr><td>Prima retorno a la experiencia</td><td style="text-align: right; white-space: nowrap;" id="primaExp">${ConvertirEnString(primaExp)}</td></tr>`
        );

        $("#tablaDevengosComp tbody").append(
            `<tr>
                <td>Prima retorno a la experiencia</td>
                <td style="text-align: right; white-space: nowrap;" id="primaExp">${ConvertirEnString(ElimAumento(primaExp))}</td>
                <td style="text-align: right; white-space: nowrap;" id="primaExp">${ConvertirEnString(primaExp)}</td>
                <td style="text-align: right; white-space: nowrap;" id="primaExp">${ConvertirEnString(primaExp - ElimAumento(primaExp))}</td>
            </tr>`
        );

        $("#tablaDevengosRetro tbody").append(
            `<tr><td>Prima retorno a la experiencia</td><td style="text-align: right; white-space: nowrap;" id="primaExp">${ConvertirEnString(primaExpRetro)}</td></tr>`
        );
    }

    if (SubFam > 0) {

        $("#tablaDevengos tbody").append(
            `<tr><td id="tituloSubFam">${titleSubFam}</td><td style="text-align: right; white-space: nowrap;" id="SubFam">${ConvertirEnString(SubFam)}</td></tr>`
        );

        $("#tablaDevengosComp tbody").append(
            `<tr>
                <td id="tituloSubFam">${titleSubFam}</td>
                <td style="text-align: right; white-space: nowrap;" id="SubFam">${ConvertirEnString(ElimAumento(SubFam))}</td>
                <td style="text-align: right; white-space: nowrap;" id="SubFam">${ConvertirEnString(SubFam)}</td>
                <td style="text-align: right; white-space: nowrap;" id="SubFam">${ConvertirEnString(SubFam - ElimAumento(SubFam))}</td>
            </tr>`
        );

        $("#tablaDevengosRetro tbody").append(
            `<tr><td id="tituloSubFam">${titleSubFamRetro}</td><td style="text-align: right; white-space: nowrap;" id="SubFam">${ConvertirEnString(SubFamRetro)}</td></tr>`
        );
    }

    if ($("#selecGrado").val() == 25.3733 && $("#distincion").val() != 0) {
        distincion = asigBasic * $("#distincion").val() / 100;
        distincionRetro = (distincion - ElimAumento(distincion)) * mes;

        $("#tablaDevengos tbody").append(
            `<tr><td>Distinción patrulleros</td><td style="text-align: right; white-space: nowrap;" id="primaExp">${ConvertirEnString(distincion)}</td></tr>`
        );

        $("#tablaDevengosComp tbody").append(
            `<tr>
                <td>Distinción patrulleros</td>
                <td style="text-align: right; white-space: nowrap;" id="">${ConvertirEnString(ElimAumento(distincion))}</td>
                <td style="text-align: right; white-space: nowrap;" id="">${ConvertirEnString(distincion)}</td>
                <td style="text-align: right; white-space: nowrap;" id="">${ConvertirEnString(distincion - ElimAumento(distincion))}</td>
            </tr>`
        );

        $("#tablaDevengosRetro tbody").append(
            `<tr><td>Distinción patrulleros</td><td style="text-align: right; white-space: nowrap;" id="primaExp">${ConvertirEnString(distincionRetro)}</td></tr>`
        );
    }

    if ($("#selecPrimaPer").val() != 0 && $("#selecGrado").val() != 25.3733) {
        primaPer = CalculoPer(asigBasic);
        primaPerRetro = (primaPer - ElimAumento(primaPer)) * mes;
        $("#tablaDevengos tbody").append(
            `<tr><td>Bonificación de permanencia</td><td style="text-align: right; white-space: nowrap;" id="primaPer">${ConvertirEnString(primaPer)}</td></tr>`
        );

        $("#tablaDevengosComp tbody").append(
            `<tr>
                <td>Bonificación de permanencia</td>
                <td style="text-align: right; white-space: nowrap;" id="">${ConvertirEnString(ElimAumento(primaPer))}</td>
                <td style="text-align: right; white-space: nowrap;" id="">${ConvertirEnString(primaPer)}</td>
                <td style="text-align: right; white-space: nowrap;" id="">${ConvertirEnString(primaPer - ElimAumento(primaPer))}</td>
            </tr>`
        );

        $("#tablaDevengosRetro tbody").append(
            `<tr><td>Bonificación de permanencia</td><td style="text-align: right; white-space: nowrap;" id="primaPer">${ConvertirEnString(primaPerRetro)}</td></tr>`
        );
    }

    $("#tablaDescuentos tbody").append(
        `<tr><td>Auxilio mutuo (valor promedio)</td><td style="text-align: right; white-space: nowrap;" id="auxDibie">${ConvertirEnString(auxMutuo)}</td></tr>
         <tr><td>Bonificación seguro de vida </td><td style="text-align: right; white-space: nowrap;" id="seguro">${ConvertirEnString(bonifSeguro)}</td></tr>
         <tr><td>Sanidad</td><td style="text-align: right; white-space: nowrap;" id="sanidad">${ConvertirEnString(sanidad)}</td></tr>
         <tr><td>Cotización CASUR</td><td style="text-align: right; white-space: nowrap;" id="casur">${ConvertirEnString(casur)}</td></tr>`
    );

    $("#tablaDescuentosComp tbody").append(
        `<tr>
            <td>Auxilio mutuo (valor promedio)</td>
            <td style="text-align: right; white-space: nowrap;" id="">${ConvertirEnString(auxMutuo)}</td>
            <td style="text-align: right; white-space: nowrap;" id="">${ConvertirEnString(auxMutuo)}</td>
            <td style="text-align: right; white-space: nowrap;" id="">${ConvertirEnString(0)}</td>
        </tr>
        <tr>
            <td>Bonificación seguro de vida</td>
            <td style="text-align: right; white-space: nowrap;" id="">${ConvertirEnString(ElimAumento(bonifSeguro))}</td>
            <td style="text-align: right; white-space: nowrap;" id="">${ConvertirEnString(bonifSeguro)}</td>
            <td style="text-align: right; white-space: nowrap;" id="">${ConvertirEnString(bonifSeguro - ElimAumento(bonifSeguro))}</td>
        </tr>
        <tr>
            <td>Sanidad</td>
            <td style="text-align: right; white-space: nowrap;" id="">${ConvertirEnString(ElimAumento(sanidad))}</td>
            <td style="text-align: right; white-space: nowrap;" id="">${ConvertirEnString(sanidad)}</td>
            <td style="text-align: right; white-space: nowrap;" id="">${ConvertirEnString(sanidad - ElimAumento(sanidad))}</td>
        </tr>
        <tr>
            <td>Cotización CASUR</td>
            <td style="text-align: right; white-space: nowrap;" id="">${ConvertirEnString(ElimAumento(casur))}</td>
            <td style="text-align: right; white-space: nowrap;" id="">${ConvertirEnString(casur)}</td>
            <td style="text-align: right; white-space: nowrap;" id="">${ConvertirEnString(casur - ElimAumento(casur))}</td>
        </tr>`
    );

    $("#tablaDescuentosRetro tbody").append(
        `<tr><td>Bonificación seguro de vida </td><td style="text-align: right; white-space: nowrap;" id="seguro">${ConvertirEnString(bonifSeguroRetro)}</td></tr>
         <tr><td>Sanidad</td><td style="text-align: right; white-space: nowrap;" id="sanidad">${ConvertirEnString(sanidadRetro)}</td></tr>
         <tr><td>Cotización CASUR</td><td style="text-align: right; white-space: nowrap;" id="casur">${ConvertirEnString(casurRetro)}</td></tr>`
    );

    if (cajaHonor > 0) {
        $("#tablaDescuentos tbody").append(
            `<tr><td>Ahorro obligatorio CajaHonor</td><td style="text-align: right; white-space: nowrap;" id="cajaHonor">${ConvertirEnString(cajaHonor)}</td></tr>`
        );

        $("#tablaDescuentosComp tbody").append(
            `<tr>
                <td>Ahorro obligatorio CajaHonor</td>
                <td style="text-align: right; white-space: nowrap;" id="">${ConvertirEnString(ElimAumento(cajaHonor))}</td>
                <td style="text-align: right; white-space: nowrap;" id="">${ConvertirEnString(cajaHonor)}</td>
                <td style="text-align: right; white-space: nowrap;" id="">${ConvertirEnString(cajaHonor - ElimAumento(cajaHonor))}</td>
            </tr>`
        );

        $("#tablaDescuentosRetro tbody").append(
            `<tr><td>Ahorro obligatorio CajaHonor</td><td style="text-align: right; white-space: nowrap;" id="cajaHonor">${ConvertirEnString(cajaHonorRetro)}</td></tr>`
        );
    }

    CalcularTotal();
});

function CalcularTotal() {

    $("#tablaTotal tbody").empty();
    $("#tablaTotalComp tbody").empty();
    $("#tablaTotalRetro tbody").empty();

    devengado = asigBasic + primaOP + primaNE + SubFam + primaExp + distincion + primaPer + subAlimentacion + bonifSeguro + otrosDevengos;
    descuentos = sanidad + casur + cajaHonor + auxMutuo + bonifSeguro + otrosDescuentos;
    total = devengado - descuentos;

    let devengadoComp = ElimAumento(devengado);
    let descuentosComp = ElimAumento(sanidad + casur + cajaHonor + bonifSeguro) + auxMutuo + otrosDescuentos;

    let devengadoRetro = asigBasicRetro + primaOPRetro + primaNERetro + SubFamRetro + primaExpRetro + distincionRetro + primaPerRetro + subAlimentacionRetro + bonifSeguroRetro + otrosDevengosRetro;
    let afilCasur = ((devengadoRetro) / mes * 10) / 30;
    let descuentosRetro = sanidadRetro + casurRetro + cajaHonorRetro + bonifSeguroRetro + otrosDescuentosRetro + afilCasur;
    let totalRetro = devengadoRetro - descuentosRetro;

    $("#tablaTotal tbody").append(
        `<tr><td>Total devengado</td><td style="text-align: right; white-space: nowrap;" id="totalDeveng">${ConvertirEnString(devengado)}</td></tr>
        <tr><td>Total descuentos</td><td style="text-align: right; white-space: nowrap;" id="totalDesc">${ConvertirEnString(descuentos)}</td></tr>
        <tr><td style="font-weight: 700; font-size: 18px; background: #73ff78;">Neto a pagar</td><td style="text-align: right; font-weight: 700; font-size: 18px; background: #73ff78;" id="totalNeto">${ConvertirEnString(total)}</td></tr>`
    );

    $("#tablaTotalComp tbody").append(
        `<tr>
            <td>Total devengado</td>
            <td style="text-align: right; white-space: nowrap;" id="">${ConvertirEnString(ElimAumento(devengado))}</td>
            <td style="text-align: right; white-space: nowrap;" id="">${ConvertirEnString(devengado)}</td>
            <td style="text-align: right; white-space: nowrap;" id="">${ConvertirEnString(devengado - ElimAumento(devengado))}</td>
        </tr>
        <tr>
            <td>Total descuentos</td>
            <td style="text-align: right; white-space: nowrap;" id="">${ConvertirEnString(descuentosComp)}</td>
            <td style="text-align: right; white-space: nowrap;" id="">${ConvertirEnString(descuentos)}</td>
            <td style="text-align: right; white-space: nowrap;" id="">${ConvertirEnString(descuentos - descuentosComp)}</td>
        </tr>
        <tr>
            <td style="font-weight: 700; font-size: 18px; background: #73ff78;">Neto a pagar</td>
            <td style="text-align: right; font-weight: 700; font-size: 18px; background: #73ff78; white-space: nowrap;" id="">${ConvertirEnString(devengadoComp - descuentosComp)}</td>
            <td style="text-align: right; font-weight: 700; font-size: 18px; background: #73ff78; white-space: nowrap;" id="">${ConvertirEnString(devengado - descuentos)}</td>
            <td style="text-align: right; font-weight: 700; font-size: 18px; background: #73ff78; white-space: nowrap;" id="">${ConvertirEnString((devengado - descuentos) - (devengadoComp - descuentosComp))}</td>
        </tr>`
    );

    $("#tablaTotalRetro tbody").append(
        `<tr><td>Total devengado</td><td style="text-align: right; white-space: nowrap;">${ConvertirEnString(devengadoRetro)}</td></tr>
        <tr><td>Total descuentos</td><td style="text-align: right; white-space: nowrap;">${ConvertirEnString(descuentosRetro)}</td></tr>
        <tr><td style="font-weight: 700">Neto a pagar</td><td style="text-align: right; font-weight: 700; font-size: 18px; background: #73ff78; white-space: nowrap;">${ConvertirEnString(totalRetro)}</td></tr>`
    );

    $("#afilCasur").remove();

    $("#tablaDescuentosRetro tbody").append(
        `<tr id="afilCasur"><td>Afiliación o aumento CASUR</td><td style="text-align: right; white-space: nowrap;">${ConvertirEnString(afilCasur)}</td></tr>`
    );

    $("#contenedorDatos").hide(500);
    $("#contenedorSalario").show(500);
    $("#contenedorSalarioComp").hide(500);
    $("#contenedorRetro").hide(500);

    SubirPagina();
}

$("#btnModalDescuentos").click(() => {
    $("#nombreDescuento").val("");
    $("#valorDescuento").val("");
    $("#modalDescuentos").modal("show");
});

$("#btnModalDevengos").click(() => {
    $("#nombreDevengo").val("");
    $("#valorDevengo").val("");
    $("#modalDevengos").modal("show");
});

$("#btnAgregarDescuento").click(() => {
    let nombreDescuento = $("#nombreDescuento").val();
    let valorDescuento = ConvertirEnFloat($("#valorDescuento").val());

    if (nombreDescuento == "")
        nombreDescuento = "Descuento x";
    if (valorDescuento == "" || valorDescuento == null || Number.isNaN(valorDescuento))
        valorDescuento = 0;

    otrosDescuentos += valorDescuento;

    $("#tablaDescuentos tbody").append(
        `<tr><td>${nombreDescuento}</td><td style="text-align: right; white-space: nowrap;" id="">${ConvertirEnString(valorDescuento)}</td></tr>`
    );

    $("#tablaDescuentosComp tbody").append(
        `<tr>
            <td>${nombreDescuento}</td>
            <td style="text-align: right; white-space: nowrap;" id="">${ConvertirEnString(valorDescuento)}</td>
            <td style="text-align: right; white-space: nowrap;" id="">${ConvertirEnString(valorDescuento)}</td>
            <td style="text-align: right; white-space: nowrap;" id="">${ConvertirEnString(0)}</td>
        </tr>`
    );

    CalcularTotal();
    $("#modalDescuentos").modal("hide");
});

$("#btnAgregarDevengo").click(() => {
    let nombreDevengo = $("#nombreDevengo").val();
    let valorDevengo = ConvertirEnFloat($("#valorDevengo").val());

    if (nombreDevengo == "")
        nombreDevengo = "Devengo x";
    if (valorDevengo == "" || valorDevengo == null || Number.isNaN(valorDevengo))
        valorDevengo = 0;

    let valorDevengoRetro = (SumAumento(valorDevengo) - valorDevengo) * mes;

    otrosDevengos += SumAumento(valorDevengo);
    otrosDevengosRetro += valorDevengoRetro;

    $("#tablaDevengos tbody").append(
        `<tr><td>${nombreDevengo}</td><td style="text-align: right; white-space: nowrap;" id="">${ConvertirEnString(SumAumento(valorDevengo))}</td></tr>`
    );

    $("#tablaDevengosComp tbody").append(
        `<tr>
            <td>${nombreDevengo}</td>
            <td style="text-align: right; white-space: nowrap;" id="">${ConvertirEnString(valorDevengo)}</td>
            <td style="text-align: right; white-space: nowrap;" id="">${ConvertirEnString(SumAumento(valorDevengo))}</td>
            <td style="text-align: right; white-space: nowrap;" id="">${ConvertirEnString(SumAumento(valorDevengo) - valorDevengo)}</td>
        </tr>`
    );

    $("#tablaDevengosRetro tbody").append(
        `<tr><td>${nombreDevengo}</td><td style="text-align: right; white-space: nowrap;" id="">${ConvertirEnString(valorDevengoRetro)}</td></tr>`
    );

    CalcularTotal();
    $("#modalDevengos").modal("hide");
});

function ConvertirEnFloat(valor) {//Recibe numero string con signo pesos y devuelve float para operarlo
    valor = parseFloat(valor.replace("$ ", "").replace(/\./g, '').replace(',', '.'));
    return valor;
}

function ConvertirEnString(valor) {// recibe numero float y lo devuelve en formato con puntos y comas y el signo $

    if (valor - Math.trunc(valor) > 0)
        valor = valor.toFixed(0);

    valor = "$ " + parseFloat(valor).toLocaleString('es-CO');
    return valor;
}

function ElimAumento(valor) {//

    valor /= (1 + ($("#aumento").val() / 100));
    return valor;
}

function SumAumento(valor) {// 

    valor += (valor * $("#aumento").val()) / 100;
    return valor;
}

function CalculoExp(asigBasic) {

    if ($("#selecGrado").val() == 52.7816) {
        if ($("#selectExp").val() > 23) {
            primaExp = asigBasic * 12 / 100;
        } else {
            primaExp = asigBasic * ($("#selectExp").val() * 0.5) / 100;
        }
    }
    else if ($("#selecGrado").val() == 44.8164) {
        if ($("#selectExp").val() > 18) {
            primaExp = asigBasic * 9.5 / 100;
        } else {
            primaExp = asigBasic * ($("#selectExp").val() * 0.5) / 100;
        }
    }
    else if ($("#selecGrado").val() == 42.6660) {
        primaExp = asigBasic * 7 / 100;
    }
    else if ($("#selecGrado").val() == 40.5007) {
        if ($("#selectExp").val() > 7) {
            primaExp = asigBasic * 7 / 100;
        } else {
            primaExp = asigBasic * $("#selectExp").val() / 100;
        }
    }
    else if ($("#selecGrado").val() == 31.8202) {
        if ($("#selectExp").val() > 7) {
            primaExp = asigBasic * 7 / 100;
        } else {
            primaExp = asigBasic * $("#selectExp").val() / 100;
        }
    }
    else if ($("#selecGrado").val() == 25.3733 && $("#selectExp").val() > 4) {
        primaExp = asigBasic * $("#selectExp").val() / 100;
    }
    else if (nivel) {
        if ($("#selectExp_OF").val() > 14) {
            primaExp = asigBasic * ($("#selectExp_OF").val() - 5) / 100;
        } else {
            primaExp = 0;
        }
    }
    else {
        primaExp = 0;
    }

    return primaExp;
}

function CalculoPer(asigBasic) {

    if ($("#selecGrado").val() == 52.7816) {
        primaPer = asigBasic * 10 / 100;
    }
    else if ($("#selecGrado").val() == 44.8164) {
        primaPer = asigBasic * 25 / 100;
    }
    else if ($("#selecGrado").val() == 42.6660) {
        primaPer = asigBasic * 30 / 100;
    }
    else if ($("#selecGrado").val() == 40.5007) {
        primaPer = asigBasic * 35 / 100;
    }
    else if ($("#selecGrado").val() == 31.8202) {
        primaPer = asigBasic * 40 / 100;
    }
    else {
        primaPer = 0;
    }

    return primaPer;
}

$("#selecGrado").change(() => {

    $("#selecSubFam").val("0");
    $("#selecAsisFam").val("0");
    $("#selecSubFam_OF").val("0");

    $("#selecOrdPub").val("0");
    $("#selecOrdPub_OF").val("0");
    $("#selecAsisFam").val("0");
    $("#selecSubFam").val("0");
    $("#selecSubFam_OF").val("0");
    $("#distincion").val("0");
    $("#selecPrimaPer").val("0");

    gradNiv = $("#selecGrado").val();
    gradNiv = $(`#selecGrado option[value='${gradNiv}']`)[0].innerText;

    if (nivelOf.find((item) => item == gradNiv))
        nivel = true;
    else
        nivel = false;

    if ($("#selecGrado").val() == 25.3733) {
        $("#mostrarSelecDistincion").css("display", "block");
        $("#mostrarSelecPrimaPer").css("display", "none");

        $("#mostrarSelecOrdPub").css("display", "block");
        $("#mostrarSelectExp").css("display", "block");
        $("#mostrarSelecSubFam").css("display", "block");
        $("#mostrarSelecAsisFam").css("display", "block");

        $("#mostrarSelecOrdPub_OF").css("display", "none");
        $("#mostrarSelectExp_OF").css("display", "none");
        $("#mostrarSelecSubFam_OF").css("display", "none");
    }
    else if (nivelOf.find((item) => item == gradNiv)) {
        $("#mostrarSelecDistincion").css("display", "none");
        $("#mostrarSelecPrimaPer").css("display", "none");

        $("#mostrarSelecOrdPub").css("display", "none");
        $("#mostrarSelectExp").css("display", "none");
        $("#mostrarSelecSubFam").css("display", "none");
        $("#mostrarSelecAsisFam").css("display", "none");

        $("#mostrarSelecOrdPub_OF").css("display", "block");
        $("#mostrarSelectExp_OF").css("display", "block");
        $("#mostrarSelecSubFam_OF").css("display", "block");
    }
    else {
        $("#mostrarSelecDistincion").css("display", "none");
        $("#mostrarSelecPrimaPer").css("display", "block");

        $("#mostrarSelecOrdPub").css("display", "block");
        $("#mostrarSelectExp").css("display", "block");
        $("#mostrarSelecSubFam").css("display", "block");
        $("#mostrarSelecAsisFam").css("display", "block");

        $("#mostrarSelecOrdPub_OF").css("display", "none");
        $("#mostrarSelectExp_OF").css("display", "none");
        $("#mostrarSelecSubFam_OF").css("display", "none");
    }
});

$("#btnRegresarDatos").click(() => {

    $("#contenedorDatos").show(500);
    $("#contenedorSalario").hide(500);
    $("#contenedorSalarioComp").hide(500);
    $("#contenedorRetro").hide(500);

    SubirPagina();
});

$("#btnRegresarSalario, #btnRegresarSalario1").click(() => {

    $("#contenedorDatos").hide(500);
    $("#contenedorSalario").show(500);
    $("#contenedorSalarioComp").hide(500);
    $("#contenedorRetro").hide(500);

    SubirPagina();
});

$("#btnRegresarSalarioComp, #btnComparar").click(() => {

    $("#contenedorDatos").hide(500);
    $("#contenedorSalario").hide(500);
    $("#contenedorSalarioComp").show(500);
    $("#contenedorRetro").hide(500);

    SubirPagina();
});

$("#btnVerRetroactivo").click(() => {

    $("#contenedorDatos").hide(500);
    $("#contenedorSalario").hide(500);
    $("#contenedorSalarioComp").hide(500);
    $("#contenedorRetro").show(500);

    SubirPagina();
});

function SubirPagina() {
    $('html, body').animate({ scrollTop: -100 /*medida de pixeles a desplazar desde el tope superior*/ })
}


$(document).ready(function () {
    setInterval(function () {
        $("#efectoBlink").animate({
            opacity: 0
        }, 200, function () {
            $("#efectoBlink").animate({ opacity: 1 }, 200)
        }
        );
    }, 600)
})