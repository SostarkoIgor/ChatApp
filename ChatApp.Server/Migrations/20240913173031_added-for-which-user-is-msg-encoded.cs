using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ChatApp.Server.Migrations
{
    /// <inheritdoc />
    public partial class addedforwhichuserismsgencoded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "EncryptedForId",
                table: "Messages",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Messages_EncryptedForId",
                table: "Messages",
                column: "EncryptedForId");

            migrationBuilder.AddForeignKey(
                name: "FK_Messages_AspNetUsers_EncryptedForId",
                table: "Messages",
                column: "EncryptedForId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Messages_AspNetUsers_EncryptedForId",
                table: "Messages");

            migrationBuilder.DropIndex(
                name: "IX_Messages_EncryptedForId",
                table: "Messages");

            migrationBuilder.DropColumn(
                name: "EncryptedForId",
                table: "Messages");
        }
    }
}
