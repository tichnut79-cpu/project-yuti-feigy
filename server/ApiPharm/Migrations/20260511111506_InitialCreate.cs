using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ApiPharm.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "medicines",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_medicines", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Pharms",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    City = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    address = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Waiting_quantity = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pharms", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "medicineInPharm",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    IdMedicine = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    MedicineId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    IdPharm = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    PharmId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    quantity = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_medicineInPharm", x => x.Id);
                    table.ForeignKey(
                        name: "FK_medicineInPharm_Pharms_PharmId",
                        column: x => x.PharmId,
                        principalTable: "Pharms",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_medicineInPharm_medicines_MedicineId",
                        column: x => x.MedicineId,
                        principalTable: "medicines",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_medicineInPharm_MedicineId",
                table: "medicineInPharm",
                column: "MedicineId");

            migrationBuilder.CreateIndex(
                name: "IX_medicineInPharm_PharmId",
                table: "medicineInPharm",
                column: "PharmId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "medicineInPharm");

            migrationBuilder.DropTable(
                name: "Pharms");

            migrationBuilder.DropTable(
                name: "medicines");
        }
    }
}
